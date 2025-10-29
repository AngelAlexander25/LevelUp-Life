import { query } from '@/lib/db'

export async function GET(request) {
  try {
    const achievements = await query(`
      SELECT 
        id,
        name,
        description,
        icon,
        category,
        requirement_type,
        requirement_value,
        rarity
      FROM achievements
      ORDER BY 
        CASE rarity
          WHEN 'common' THEN 1
          WHEN 'rare' THEN 2
          WHEN 'epic' THEN 3
          WHEN 'legendary' THEN 4
        END,
        id
    `)

    // Agrupar por rareza
    const grouped = {
      common: [],
      rare: [],
      epic: [],
      legendary: []
    }

    achievements.forEach(achievement => {
      grouped[achievement.rarity].push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        requirementType: achievement.requirement_type,
        requirementValue: achievement.requirement_value,
        rarity: achievement.rarity
      })
    })

    return Response.json({
      success: true,
      achievements: achievements.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        requirementType: a.requirement_type,
        requirementValue: a.requirement_value,
        rarity: a.rarity
      })),
      grouped,
      total: achievements.length
    })

  } catch (error) {
    console.error('Error en GET /api/achievements:', error)
    return Response.json(
      { error: 'Error al obtener logros' },
      { status: 500 }
    )
  }
}