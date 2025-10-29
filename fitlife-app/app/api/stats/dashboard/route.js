import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'
import { calculateLevelProgress, getLevelTitle } from '@/lib/utils'

export async function GET(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener datos del usuario
    const [user] = await query(`
      SELECT 
        username,
        level,
        total_points,
        current_streak,
        longest_streak,
        total_habits_completed,
        total_exercise_minutes
      FROM users
      WHERE id = ?
    `, [userId])

    if (!user) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Calcular progreso de nivel
    const levelProgress = calculateLevelProgress(user.total_points)
    const levelTitle = getLevelTitle(user.level)

    // Obtener hábitos completados hoy
    const today = new Date().toISOString().split('T')[0]
    const completedToday = await query(`
      SELECT COUNT(*) as count
      FROM habit_completions
      WHERE user_id = ? AND DATE(completed_at) = ?
    `, [userId, today])

    // Obtener total de hábitos activos
    const activeHabits = await query(`
      SELECT COUNT(*) as count
      FROM user_habits
      WHERE user_id = ? AND is_active = TRUE
    `, [userId])

    // Obtener puntos ganados hoy
    const pointsToday = await query(`
      SELECT COALESCE(SUM(points_earned), 0) as total
      FROM habit_completions
      WHERE user_id = ? AND DATE(completed_at) = ?
    `, [userId, today])

    // Obtener últimos logros (últimos 3)
    const recentAchievements = await query(`
      SELECT 
        a.name,
        a.icon,
        a.rarity,
        ua.unlocked_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
      ORDER BY ua.unlocked_at DESC
      LIMIT 3
    `, [userId])

    // Obtener progreso de la semana (últimos 7 días)
    const weekProgress = await query(`
      SELECT 
        DATE(completed_at) as date,
        COUNT(*) as habits_count,
        SUM(points_earned) as points
      FROM habit_completions
      WHERE user_id = ? 
        AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(completed_at)
      ORDER BY date
    `, [userId])

    return Response.json({
      success: true,
      user: {
        username: user.username,
        level: user.level,
        levelTitle,
        totalPoints: user.total_points,
        levelProgress,
        currentStreak: user.current_streak,
        longestStreak: user.longest_streak,
        totalHabitsCompleted: user.total_habits_completed,
        totalExerciseMinutes: user.total_exercise_minutes
      },
      today: {
        habitsCompleted: completedToday[0].count,
        totalActiveHabits: activeHabits[0].count,
        pointsEarned: pointsToday[0].total,
        completionPercentage: activeHabits[0].count > 0 
          ? Math.round((completedToday[0].count / activeHabits[0].count) * 100)
          : 0
      },
      recentAchievements: recentAchievements.map(a => ({
        name: a.name,
        icon: a.icon,
        rarity: a.rarity,
        unlockedAt: a.unlocked_at
      })),
      weekProgress: weekProgress.map(day => ({
        date: day.date,
        habitsCount: day.habits_count,
        points: day.points
      }))
    })

  } catch (error) {
    console.error('Error en GET /api/stats/dashboard:', error)
    return Response.json(
      { error: 'Error al obtener estadísticas del dashboard' },
      { status: 500 }
    )
  }
}