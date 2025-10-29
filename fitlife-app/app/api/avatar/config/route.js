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

    const [config] = await query(
      'SELECT * FROM user_avatar_config WHERE user_id = ?',
      [userId]
    )

    if (!config) {
      // Retornar configuración por defecto
      return Response.json({
        success: true,
        config: {
          sex: 'man',
          faceColor: '#F9C9B6',
          earSize: 'small',
          hairStyle: 'normal',
          hairColor: '#000',
          hatStyle: 'none',
          eyeStyle: 'circle',
          glassesStyle: 'none',
          noseStyle: 'short',
          mouthStyle: 'smile',
          shirtStyle: 'hoody',
          shirtColor: '#77311D',
          bgColor: '#E0DDFF'
        }
      })
    }

    return Response.json({
      success: true,
      config: {
        sex: config.sex,
        faceColor: config.face_color,
        earSize: config.ear_size,
        hairStyle: config.hair_style,
        hairColor: config.hair_color,
        hatStyle: config.hat_style,
        eyeStyle: config.eye_style,
        glassesStyle: config.glasses_style,
        noseStyle: config.nose_style,
        mouthStyle: config.mouth_style,
        shirtStyle: config.shirt_style,
        shirtColor: config.shirt_color,
        bgColor: config.bg_color
      }
    })

  } catch (error) {
    console.error('Error en GET /api/avatar/config:', error)
    return Response.json(
      { error: 'Error al obtener configuración de avatar' },
      { status: 500 }
    )
  }
}