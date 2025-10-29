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

    // Obtener estadísticas de los últimos 7 días
    const stats = await query(`
      SELECT 
        DATE(completed_at) as date,
        COUNT(DISTINCT habit_id) as unique_habits,
        COUNT(*) as total_completions,
        SUM(points_earned) as total_points,
        SUM(duration_minutes) as total_minutes
      FROM habit_completions
      WHERE user_id = ? 
        AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(completed_at)
      ORDER BY date
    `, [userId])

    // Obtener hábitos más completados esta semana
    const topHabits = await query(`
      SELECT 
        h.name,
        h.icon,
        hc.color,
        COUNT(*) as times_completed,
        SUM(hcomp.points_earned) as total_points
      FROM habit_completions hcomp
      JOIN habits h ON hcomp.habit_id = h.id
      JOIN habit_categories hc ON h.category_id = hc.id
      WHERE hcomp.user_id = ? 
        AND hcomp.completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY h.id, h.name, h.icon, hc.color
      ORDER BY times_completed DESC
      LIMIT 5
    `, [userId])

    // Obtener distribución por categoría
    const categoryDistribution = await query(`
      SELECT 
        hc.name as category,
        hc.color,
        COUNT(*) as count,
        SUM(hcomp.points_earned) as points
      FROM habit_completions hcomp
      JOIN habits h ON hcomp.habit_id = h.id
      JOIN habit_categories hc ON h.category_id = hc.id
      WHERE hcomp.user_id = ? 
        AND hcomp.completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY hc.id, hc.name, hc.color
    `, [userId])

    // Calcular totales
    const totals = stats.reduce((acc, day) => ({
      habits: acc.habits + day.unique_habits,
      completions: acc.completions + day.total_completions,
      points: acc.points + day.total_points,
      minutes: acc.minutes + (day.total_minutes || 0)
    }), { habits: 0, completions: 0, points: 0, minutes: 0 })

    return Response.json({
      success: true,
      dailyStats: stats.map(day => ({
        date: day.date,
        uniqueHabits: day.unique_habits,
        totalCompletions: day.total_completions,
        totalPoints: day.total_points,
        totalMinutes: day.total_minutes || 0
      })),
      topHabits: topHabits.map(h => ({
        name: h.name,
        icon: h.icon,
        color: h.color,
        timesCompleted: h.times_completed,
        totalPoints: h.total_points
      })),
      categoryDistribution: categoryDistribution.map(c => ({
        category: c.category,
        color: c.color,
        count: c.count,
        points: c.points
      })),
      totals: {
        uniqueHabits: totals.habits,
        totalCompletions: totals.completions,
        totalPoints: totals.points,
        totalMinutes: totals.minutes,
        averagePerDay: Math.round(totals.completions / 7)
      }
    })

  } catch (error) {
    console.error('Error en GET /api/stats/weekly:', error)
    return Response.json(
      { error: 'Error al obtener estadísticas semanales' },
      { status: 500 }
    )
  }
}