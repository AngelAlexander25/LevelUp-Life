import { query } from '@/lib/db'

export async function GET(request) {
  try {
    // Obtener todos los hábitos con su categoría
    const habits = await query(`
      SELECT 
        h.id,
        h.name,
        h.description,
        h.points_value,
        h.estimated_calories,
        h.duration_minutes,
        h.icon,
        hc.id as category_id,
        hc.name as category_name,
        hc.icon as category_icon,
        hc.color as category_color
      FROM habits h
      JOIN habit_categories hc ON h.category_id = hc.id
      ORDER BY hc.id, h.id
    `)

    // Agrupar por categoría
    const grouped = habits.reduce((acc, habit) => {
      const categoryName = habit.category_name
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          id: habit.category_id,
          name: categoryName,
          icon: habit.category_icon,
          color: habit.category_color,
          habits: []
        }
      }
      
      acc[categoryName].habits.push({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        pointsValue: habit.points_value,
        estimatedCalories: habit.estimated_calories,
        durationMinutes: habit.duration_minutes,
        icon: habit.icon
      })
      
      return acc
    }, {})

    return Response.json({
      success: true,
      categories: Object.values(grouped),
      totalHabits: habits.length
    })

  } catch (error) {
    console.error('Error en GET /api/habits:', error)
    return Response.json(
      { error: 'Error al obtener hábitos' },
      { status: 500 }
    )
  }
}