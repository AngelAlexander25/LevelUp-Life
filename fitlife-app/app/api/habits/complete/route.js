import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'
import { calculateLevel } from '@/lib/utils'

export async function POST(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { habitId, durationMinutes, notes } = body

    if (!habitId) {
      return Response.json(
        { error: 'habitId es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el hábito está activo para el usuario
    const [userHabit] = await query(`
      SELECT uh.id, h.points_value, h.estimated_calories
      FROM user_habits uh
      JOIN habits h ON uh.habit_id = h.id
      WHERE uh.user_id = ? AND uh.habit_id = ? AND uh.is_active = TRUE
    `, [userId, habitId])

    if (!userHabit) {
      return Response.json(
        { error: 'Este hábito no está activado para ti' },
        { status: 400 }
      )
    }

    // Verificar si ya lo completó hoy
    const today = new Date().toISOString().split('T')[0]
    const [alreadyCompleted] = await query(`
      SELECT id FROM habit_completions
      WHERE user_id = ? AND habit_id = ? AND DATE(completed_at) = ?
    `, [userId, habitId, today])

    if (alreadyCompleted) {
      return Response.json(
        { error: 'Ya completaste este hábito hoy' },
        { status: 400 }
      )
    }

    const pointsEarned = userHabit.points_value
    const caloriesBurned = userHabit.estimated_calories || 0

    // Iniciar transacción (simulada con múltiples queries)
    
    // 1. Registrar la completación
    await query(`
      INSERT INTO habit_completions 
      (user_id, habit_id, points_earned, duration_minutes, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, habitId, pointsEarned, durationMinutes || null, notes || null])

    // 2. Obtener datos actuales del usuario
    const [currentUser] = await query(`
      SELECT total_points, level, current_streak, longest_streak, 
             total_habits_completed, total_exercise_minutes
      FROM users WHERE id = ?
    `, [userId])

    const newTotalPoints = currentUser.total_points + pointsEarned
    const newLevel = calculateLevel(newTotalPoints)
    const leveledUp = newLevel > currentUser.level

    // 3. Calcular racha
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const [completedYesterday] = await query(`
      SELECT COUNT(*) as count FROM habit_completions
      WHERE user_id = ? AND DATE(completed_at) = ?
    `, [userId, yesterdayStr])

    let newStreak = currentUser.current_streak
    if (completedYesterday && completedYesterday.count > 0) {
      // Continuó la racha
      newStreak = currentUser.current_streak + 1
    } else {
      // Empezó nueva racha
      newStreak = 1
    }

    const newLongestStreak = Math.max(newStreak, currentUser.longest_streak)

    // 4. Actualizar usuario
    await query(`
      UPDATE users SET
        total_points = ?,
        level = ?,
        current_streak = ?,
        longest_streak = ?,
        total_habits_completed = total_habits_completed + 1,
        total_exercise_minutes = total_exercise_minutes + ?
      WHERE id = ?
    `, [
      newTotalPoints,
      newLevel,
      newStreak,
      newLongestStreak,
      durationMinutes || 0,
      userId
    ])

    // 5. Actualizar estadísticas diarias
    await query(`
      INSERT INTO user_stats 
      (user_id, date, total_exercise_minutes, estimated_calories, habits_completed_count)
      VALUES (?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        total_exercise_minutes = total_exercise_minutes + ?,
        estimated_calories = estimated_calories + ?,
        habits_completed_count = habits_completed_count + 1
    `, [
      userId,
      today,
      durationMinutes || 0,
      caloriesBurned,
      durationMinutes || 0,
      caloriesBurned
    ])

    // 6. Verificar logros desbloqueados (simplificado por ahora)
    const newAchievements = await checkAchievements(userId, {
      totalPoints: newTotalPoints,
      level: newLevel,
      streak: newStreak,
      totalHabits: currentUser.total_habits_completed + 1
    })

    // Respuesta
    return Response.json({
      success: true,
      message: '¡Hábito completado!',
      pointsEarned,
      caloriesBurned,
      newTotalPoints,
      newLevel,
      leveledUp,
      newStreak,
      streakIncreased: newStreak > currentUser.current_streak,
      newAchievements
    })

  } catch (error) {
    console.error('Error en POST /api/habits/complete:', error)
    return Response.json(
      { error: 'Error al completar hábito' },
      { status: 500 }
    )
  }
}

// Función auxiliar para verificar logros
async function checkAchievements(userId, stats) {
  const newAchievements = []

  try {
    // Obtener logros que el usuario NO tiene
    const availableAchievements = await query(`
      SELECT a.* FROM achievements a
      WHERE a.id NOT IN (
        SELECT achievement_id FROM user_achievements WHERE user_id = ?
      )
    `, [userId])

    for (const achievement of availableAchievements) {
      let unlocked = false

      switch (achievement.requirement_type) {
        case 'first_habit':
          unlocked = stats.totalHabits >= 1
          break
        
        case 'total_habits':
          unlocked = stats.totalHabits >= achievement.requirement_value
          break
        
        case 'streak':
          unlocked = stats.streak >= achievement.requirement_value
          break
        
        case 'level':
          unlocked = stats.level >= achievement.requirement_value
          break
        
        // Agregar más tipos según necesites
      }

      if (unlocked) {
        // Desbloquear logro
        await query(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
          [userId, achievement.id]
        )
        
        newAchievements.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          rarity: achievement.rarity
        })
      }
    }

  } catch (error) {
    console.error('Error checking achievements:', error)
  }

  return newAchievements
}