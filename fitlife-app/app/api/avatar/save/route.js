import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'

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
    const {
      sex,
      faceColor,
      earSize,
      hairStyle,
      hairColor,
      hatStyle,
      eyeStyle,
      glassesStyle,
      noseStyle,
      mouthStyle,
      shirtStyle,
      shirtColor,
      bgColor
    } = body

    // Verificar si ya existe configuración
    const [existing] = await query(
      'SELECT id FROM user_avatar_config WHERE user_id = ?',
      [userId]
    )

    if (existing) {
      // Actualizar
      await query(`
        UPDATE user_avatar_config SET
          sex = ?,
          face_color = ?,
          ear_size = ?,
          hair_style = ?,
          hair_color = ?,
          hat_style = ?,
          eye_style = ?,
          glasses_style = ?,
          nose_style = ?,
          mouth_style = ?,
          shirt_style = ?,
          shirt_color = ?,
          bg_color = ?,
          updated_at = NOW()
        WHERE user_id = ?
      `, [
        sex, faceColor, earSize, hairStyle, hairColor, hatStyle,
        eyeStyle, glassesStyle, noseStyle, mouthStyle,
        shirtStyle, shirtColor, bgColor, userId
      ])
    } else {
      // Insertar nuevo
      await query(`
        INSERT INTO user_avatar_config (
          user_id, sex, face_color, ear_size, hair_style, hair_color,
          hat_style, eye_style, glasses_style, nose_style, mouth_style,
          shirt_style, shirt_color, bg_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, sex, faceColor, earSize, hairStyle, hairColor, hatStyle,
        eyeStyle, glassesStyle, noseStyle, mouthStyle,
        shirtStyle, shirtColor, bgColor
      ])
    }

    return Response.json({
      success: true,
      message: 'Avatar guardado exitosamente'
    })

  } catch (error) {
    console.error('Error en POST /api/avatar/save:', error)
    return Response.json(
      { error: 'Error al guardar avatar' },
      { status: 500 }
    )
  }
}