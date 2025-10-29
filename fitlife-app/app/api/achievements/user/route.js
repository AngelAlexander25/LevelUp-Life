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

    // Obtener logros desbloqueados
    const unlockedAchievements = await query(`
      SELECT 
        a.id,
        a.name,
        a.description,
        a.icon,
        a.category,
        a.requirement_type,
        a.requirement_value,
        a.rarity,
        ua.unlocked_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
      ORDER BY ua.unlocked_at DESC
    `, [userId])

    // Obtener todos los logros para calcular progreso
    const allAchievements = await query('SELECT * FROM achievements')

    // Obtener estadísticas del usuario para calcular progreso
    const [user] = await query(`
      SELECT 
        level,
        total_points,
        current_streak,
        total_habits_completed
      FROM users
      WHERE id = ?
    `, [userId])

    // Calcular progreso hacia logros no desbloqueados
    const unlockedIds = unlockedAchievements.map(a => a.id)
    const lockedAchievements = allAchievements
      .filter(a => !unlockedIds.includes(a.id))
      .map(a => {
        let progress = 0
        let current = 0
        
        switch (a.requirement_type) {
          case 'level':
            current = user.level
            progress = Math.min((current / a.requirement_value) * 100, 100)
            break
          case 'streak':
            current = user.current_streak
            progress = Math.min((current / a.requirement_value) * 100, 100)
            break
          case 'total_habits':
            current = user.total_habits_completed
            progress = Math.min((current / a.requirement_value) * 100, 100)
            break
          case 'first_habit':
            current = user.total_habits_completed
            progress = current >= 1 ? 100 : 0
            break
          default:
            progress = 0
        }

        return {
          id: a.id,
          name: a.name,
          description: a.description,
          icon: a.icon,
          category: a.category,
          requirementType: a.requirement_type,
          requirementValue: a.requirement_value,
          rarity: a.rarity,
          progress: Math.round(progress),
          current,
          locked: true
        }
      })

    return Response.json({
      success: true,
      unlocked: unlockedAchievements.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        rarity: a.rarity,
        unlockedAt: a.unlocked_at,
        locked: false
      })),
      locked: lockedAchievements,
      totalUnlocked: unlockedAchievements.length,
      totalAchievements: allAchievements.length,
      completionPercentage: Math.round((unlockedAchievements.length / allAchievements.length) * 100)
    })

  } catch (error) {
    console.error('Error en GET /api/achievements/user:', error)
    return Response.json(
      { error: 'Error al obtener logros del usuario' },
      { status: 500 }
    )
  }
}