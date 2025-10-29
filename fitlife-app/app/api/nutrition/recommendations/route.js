import { query } from '@/lib/db'
import { getAuthUserId } from '@/lib/auth'
import { generateMealRecommendations } from '@/lib/nutrition'

export async function GET(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener perfil nutricional del usuario
    const [profile] = await query(
      'SELECT * FROM user_profile WHERE user_id = ?',
      [userId]
    )

    if (!profile) {
      return Response.json({
        success: false,
        error: 'Debes completar tu perfil nutricional primero',
        profileCompleted: false
      }, { status: 400 })
    }

    // Obtener todas las recetas de la BD
    const recipes = await query('SELECT * FROM recipes')

    // Generar recomendaciones basadas en el perfil
    const recommendations = generateMealRecommendations(profile, recipes)

    // Obtener recetas favoritas del usuario
    const favoriteIds = await query(
      'SELECT recipe_id FROM favorite_recipes WHERE user_id = ?',
      [userId]
    )
    const favoriteIdsList = favoriteIds.map(f => f.recipe_id)

    // Formatear recomendaciones
    const formatRecipes = (recipesList) => {
      return recipesList.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        calories: recipe.total_calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        prepTime: recipe.prep_time_minutes,
        difficulty: recipe.difficulty,
        ingredients: JSON.parse(recipe.ingredients || '[]'),
        instructions: recipe.instructions,
        isVegetarian: recipe.is_vegetarian,
        isVegan: recipe.is_vegan,
        isGlutenFree: recipe.is_gluten_free,
        tags: JSON.parse(recipe.tags || '[]'),
        isFavorite: favoriteIdsList.includes(recipe.id)
      }))
    }

    return Response.json({
      success: true,
      profileCompleted: true,
      targets: {
        dailyCalories: profile.daily_calories_target,
        protein: profile.protein_target,
        carbs: profile.carbs_target,
        fat: profile.fat_target
      },
      recommendations: {
        breakfast: formatRecipes(recommendations.breakfast),
        lunch: formatRecipes(recommendations.lunch),
        dinner: formatRecipes(recommendations.dinner),
        snacks: formatRecipes(recommendations.snacks)
      },
      dietaryPreference: profile.dietary_preference,
      goal: profile.goal
    })

  } catch (error) {
    console.error('Error en GET /api/nutrition/recommendations:', error)
    return Response.json(
      { error: 'Error al obtener recomendaciones' },
      { status: 500 }
    )
  }
}