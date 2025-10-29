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
    const { recipeId, action } = body // action: 'add' o 'remove'

    if (!recipeId) {
      return Response.json(
        { error: 'recipeId es requerido' },
        { status: 400 }
      )
    }

    if (action === 'add') {
      // Verificar que la receta existe
      const [recipe] = await query(
        'SELECT id FROM recipes WHERE id = ?',
        [recipeId]
      )

      if (!recipe) {
        return Response.json(
          { error: 'Receta no encontrada' },
          { status: 404 }
        )
      }

      // Agregar a favoritos (ignorar si ya existe)
      await query(
        'INSERT IGNORE INTO favorite_recipes (user_id, recipe_id) VALUES (?, ?)',
        [userId, recipeId]
      )

      return Response.json({
        success: true,
        message: 'Receta agregada a favoritos'
      })

    } else if (action === 'remove') {
      // Quitar de favoritos
      await query(
        'DELETE FROM favorite_recipes WHERE user_id = ? AND recipe_id = ?',
        [userId, recipeId]
      )

      return Response.json({
        success: true,
        message: 'Receta eliminada de favoritos'
      })

    } else {
      return Response.json(
        { error: 'Acción inválida. Usa "add" o "remove"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error en POST /api/nutrition/favorites:', error)
    return Response.json(
      { error: 'Error al modificar favoritos' },
      { status: 500 }
    )
  }
}

// GET - Obtener recetas favoritas del usuario
export async function GET(request) {
  try {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const favorites = await query(`
      SELECT 
        r.*,
        fr.added_at
      FROM favorite_recipes fr
      JOIN recipes r ON fr.recipe_id = r.id
      WHERE fr.user_id = ?
      ORDER BY fr.added_at DESC
    `, [userId])

    const formattedFavorites = favorites.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      mealType: recipe.meal_type,
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
      addedAt: recipe.added_at
    }))

    return Response.json({
      success: true,
      favorites: formattedFavorites,
      total: formattedFavorites.length
    })

  } catch (error) {
    console.error('Error en GET /api/nutrition/favorites:', error)
    return Response.json(
      { error: 'Error al obtener recetas favoritas' },
      { status: 500 }
    )
  }
}
