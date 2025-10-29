import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'
import { getLevelTitle } from '@/lib/utils'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, week, month
    const limit = parseInt(searchParams.get('limit')) || 50

    const userId = getAuthUserId(request)

    let leaderboardQuery = ''
    let params = []

    switch (period) {
      case 'week':
        // Ranking basado en puntos de la última semana
        leaderboardQuery = `
          SELECT 
            u.id,
            u.username,
            u.level,
            u.current_streak,
            COALESCE(SUM(hc.points_earned), 0) as period_points
          FROM users u
          LEFT JOIN habit_completions hc ON u.id = hc.user_id
            AND hc.completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
          GROUP BY u.id, u.username, u.level, u.current_streak
          ORDER BY period_points DESC, u.level DESC
          LIMIT ?
        `
        params = [limit]
        break

      case 'month':
        // Ranking basado en puntos del último mes
        leaderboardQuery = `
          SELECT 
            u.id,
            u.username,
            u.level,
            u.current_streak,
            COALESCE(SUM(hc.points_earned), 0) as period_points
          FROM users u
          LEFT JOIN habit_completions hc ON u.id = hc.user_id
            AND hc.completed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          GROUP BY u.id, u.username, u.level, u.current_streak
          ORDER BY period_points DESC, u.level DESC
          LIMIT ?
        `
        params = [limit]
        break

      case 'all':
      default:
        // Ranking basado en puntos totales
        leaderboardQuery = `
          SELECT 
            u.id,
            u.username,
            u.level,
            u.total_points as period_points,
            u.current_streak
          FROM users u
          ORDER BY u.total_points DESC, u.level DESC
          LIMIT ?
        `
        params = [limit]
        break
    }

    const leaderboard = await query(leaderboardQuery, params)

    // Obtener posición del usuario actual si está autenticado
    let userRank = null
    if (userId) {
      let rankQuery = ''
      let rankParams = []

      switch (period) {
        case 'week':
          rankQuery = `
            SELECT COUNT(*) + 1 as rank
            FROM (
              SELECT u.id, COALESCE(SUM(hc.points_earned), 0) as points
              FROM users u
              LEFT JOIN habit_completions hc ON u.id = hc.user_id
                AND hc.completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
              GROUP BY u.id
            ) as rankings
            WHERE points > (
              SELECT COALESCE(SUM(points_earned), 0)
              FROM habit_completions
              WHERE user_id = ? 
                AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            )
          `
          rankParams = [userId]
          break

        case 'month':
          rankQuery = `
            SELECT COUNT(*) + 1 as rank
            FROM (
              SELECT u.id, COALESCE(SUM(hc.points_earned), 0) as points
              FROM users u
              LEFT JOIN habit_completions hc ON u.id = hc.user_id
                AND hc.completed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
              GROUP BY u.id
            ) as rankings
            WHERE points > (
              SELECT COALESCE(SUM(points_earned), 0)
              FROM habit_completions
              WHERE user_id = ? 
                AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            )
          `
          rankParams = [userId]
          break

        case 'all':
        default:
          rankQuery = `
            SELECT COUNT(*) + 1 as rank
            FROM users
            WHERE total_points > (
              SELECT total_points FROM users WHERE id = ?
            )
          `
          rankParams = [userId]
          break
      }

      const [rank] = await query(rankQuery, rankParams)
      userRank = rank.rank
    }

    // Formatear respuesta
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      level: user.level,
      levelTitle: getLevelTitle(user.level),
      points: user.period_points,
      currentStreak: user.current_streak,
      isCurrentUser: userId ? user.id === userId : false
    }))

    return Response.json({
      success: true,
      period,
      leaderboard: formattedLeaderboard,
      userRank,
      total: leaderboard.length
    })

  } catch (error) {
    console.error('Error en GET /api/leaderboard:', error)
    return Response.json(
      { error: 'Error al obtener leaderboard' },
      { status: 500 }
    )
  }
}