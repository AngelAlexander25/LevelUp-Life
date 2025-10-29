import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'

export async function GET(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener hábitos activos del usuario con información completa
    const userHabits = await query(`
      SELECT 
        uh.id as user_habit_id,
        uh.is_active,
        uh.custom_name,
        h.id as habit_id,
        h.name,
        h.description,
        h.points_value,
        h.estimated_calories,
        h.duration_minutes,
        h.icon,
        hc.id as category_id,
        hc.name as category_name,
        hc.color as category_color
      FROM user_habits uh
      JOIN habits h ON uh.habit_id = h.id
      JOIN habit_categories hc ON h.category_id = hc.id
      WHERE uh.user_id = ? AND uh.is_active = TRUE
      ORDER BY hc.id, h.id
    `, [userId])

    // Obtener completados de hoy
    const today = new Date().toISOString().split('T')[0]
    const completedToday = await query(`
      SELECT habit_id
      FROM habit_completions
      WHERE user_id = ? AND DATE(completed_at) = ?
    `, [userId, today])

    const completedIds = completedToday.map(c => c.habit_id)

    // Marcar cuáles ya fueron completados hoy
    const habitsWithStatus = userHabits.map(habit => ({
      userHabitId: habit.user_habit_id,
      habitId: habit.habit_id,
      name: habit.custom_name || habit.name,
      description: habit.description,
      pointsValue: habit.points_value,
      estimatedCalories: habit.estimated_calories,
      durationMinutes: habit.duration_minutes,
      icon: habit.icon,
      category: {
        id: habit.category_id,
        name: habit.category_name,
        color: habit.category_color
      },
      completedToday: completedIds.includes(habit.habit_id)
    }))

    return Response.json({
      success: true,
      habits: habitsWithStatus,
      totalActive: habitsWithStatus.length,
      completedToday: completedIds.length
    })

  } catch (error) {
    console.error('Error en GET /api/habits/user:', error)
    return Response.json(
      { error: 'Error al obtener hábitos del usuario' },
      { status: 500 }
    )
  }
}

// POST - Activar un hábito para el usuario
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
    const { habitId, customName } = body

    if (!habitId) {
      return Response.json(
        { error: 'habitId es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el hábito existe
    const [habit] = await query(
      'SELECT id FROM habits WHERE id = ?',
      [habitId]
    )

    if (!habit) {
      return Response.json(
        { error: 'Hábito no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si ya está activado
    const existing = await query(
      'SELECT id, is_active FROM user_habits WHERE user_id = ? AND habit_id = ?',
      [userId, habitId]
    )

    if (existing.length > 0) {
      // Si existe pero está inactivo, reactivarlo
      if (!existing[0].is_active) {
        await query(
          'UPDATE user_habits SET is_active = TRUE WHERE id = ?',
          [existing[0].id]
        )
        
        return Response.json({
          success: true,
          message: 'Hábito reactivado'
        })
      }
      
      return Response.json(
        { error: 'Este hábito ya está activado' },
        { status: 400 }
      )
    }

    // Insertar nuevo hábito activo
    await query(
      'INSERT INTO user_habits (user_id, habit_id, custom_name) VALUES (?, ?, ?)',
      [userId, habitId, customName || null]
    )

    return Response.json({
      success: true,
      message: 'Hábito activado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error en POST /api/habits/user:', error)
    return Response.json(
      { error: 'Error al activar hábito' },
      { status: 500 }
    )
  }
}

// DELETE - Desactivar un hábito
export async function DELETE(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')

    if (!habitId) {
      return Response.json(
        { error: 'habitId es requerido' },
        { status: 400 }
      )
    }

    // Desactivar (no eliminar, para mantener historial)
    await query(
      'UPDATE user_habits SET is_active = FALSE WHERE user_id = ? AND habit_id = ?',
      [userId, habitId]
    )

    return Response.json({
      success: true,
      message: 'Hábito desactivado'
    })

  } catch (error) {
    console.error('Error en DELETE /api/habits/user:', error)
    return Response.json(
      { error: 'Error al desactivar hábito' },
      { status: 500 }
    )
  }
}