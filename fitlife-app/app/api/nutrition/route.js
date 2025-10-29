import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'
import { calculateNutritionPlan } from '@/lib/nutrition'

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
      age,
      gender,
      weight,
      height,
      goal,
      activityLevel,
      dietaryPreference,
      allergies,
      healthConditions
    } = body

    // Validaciones
    if (!age || !gender || !weight || !height) {
      return Response.json(
        { error: 'Edad, género, peso y altura son requeridos' },
        { status: 400 }
      )
    }

    if (age < 15 || age > 120) {
      return Response.json(
        { error: 'Edad debe estar entre 15 y 120 años' },
        { status: 400 }
      )
    }

    if (weight < 30 || weight > 300) {
      return Response.json(
        { error: 'Peso debe estar entre 30 y 300 kg' },
        { status: 400 }
      )
    }

    if (height < 100 || height > 250) {
      return Response.json(
        { error: 'Altura debe estar entre 100 y 250 cm' },
        { status: 400 }
      )
    }

    // Calcular plan nutricional automáticamente
    const nutritionPlan = calculateNutritionPlan({
      age,
      gender,
      weight,
      height,
      activity_level: activityLevel || 'moderate',
      goal: goal || 'improve_health'
    })

    // Verificar si ya existe perfil
    const [existing] = await query(
      'SELECT id FROM user_profile WHERE user_id = ?',
      [userId]
    )

    if (existing) {
      // Actualizar perfil existente
      await query(`
        UPDATE user_profile SET
          age = ?,
          gender = ?,
          weight = ?,
          height = ?,
          goal = ?,
          activity_level = ?,
          dietary_preference = ?,
          allergies = ?,
          health_conditions = ?,
          daily_calories_target = ?,
          protein_target = ?,
          carbs_target = ?,
          fat_target = ?,
          updated_at = NOW()
        WHERE user_id = ?
      `, [
        age,
        gender,
        weight,
        height,
        goal || 'improve_health',
        activityLevel || 'moderate',
        dietaryPreference || 'none',
        allergies || null,
        healthConditions || null,
        nutritionPlan.dailyCalories,
        nutritionPlan.protein,
        nutritionPlan.carbs,
        nutritionPlan.fat,
        userId
      ])
    } else {
      // Crear nuevo perfil
      await query(`
        INSERT INTO user_profile (
          user_id, age, gender, weight, height, goal, activity_level,
          dietary_preference, allergies, health_conditions,
          daily_calories_target, protein_target, carbs_target, fat_target
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        age,
        gender,
        weight,
        height,
        goal || 'improve_health',
        activityLevel || 'moderate',
        dietaryPreference || 'none',
        allergies || null,
        healthConditions || null,
        nutritionPlan.dailyCalories,
        nutritionPlan.protein,
        nutritionPlan.carbs,
        nutritionPlan.fat
      ])
    }

    return Response.json({
      success: true,
      message: 'Perfil nutricional guardado exitosamente',
      nutritionPlan: {
        tmb: nutritionPlan.tmb,
        dailyCalories: nutritionPlan.dailyCalories,
        protein: nutritionPlan.protein,
        carbs: nutritionPlan.carbs,
        fat: nutritionPlan.fat,
        mealsDistribution: nutritionPlan.mealsDistribution
      }
    }, { status: existing ? 200 : 201 })

  } catch (error) {
    console.error('Error en POST /api/nutrition/profile:', error)
    return Response.json(
      { error: 'Error al guardar perfil nutricional' },
      { status: 500 }
    )
  }
}

// GET - Obtener perfil nutricional
export async function GET(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const [profile] = await query(
      'SELECT * FROM user_profile WHERE user_id = ?',
      [userId]
    )

    if (!profile) {
      return Response.json({
        success: true,
        profile: null,
        message: 'No has completado tu perfil nutricional'
      })
    }

    // Calcular IMC (Índice de Masa Corporal)
    const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    
    let bmiCategory = ''
    if (bmi < 18.5) bmiCategory = 'Bajo peso'
    else if (bmi < 25) bmiCategory = 'Peso normal'
    else if (bmi < 30) bmiCategory = 'Sobrepeso'
    else bmiCategory = 'Obesidad'

    return Response.json({
      success: true,
      profile: {
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
        goal: profile.goal,
        activityLevel: profile.activity_level,
        dietaryPreference: profile.dietary_preference,
        allergies: profile.allergies,
        healthConditions: profile.health_conditions,
        dailyCaloriesTarget: profile.daily_calories_target,
        proteinTarget: profile.protein_target,
        carbsTarget: profile.carbs_target,
        fatTarget: profile.fat_target,
        bmi: parseFloat(bmi),
        bmiCategory,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    })

  } catch (error) {
    console.error('Error en GET /api/nutrition/profile:', error)
    return Response.json(
      { error: 'Error al obtener perfil nutricional' },
      { status: 500 }
    )
  }
}