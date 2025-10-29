// Calcular Tasa Metabólica Basal (TMB) - Fórmula Harris-Benedict
export function calculateTMB(weight, height, age, gender) {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else if (gender === 'female') {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
  // Default a fórmula masculina si no se especifica
  return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
}

// Calcular calorías diarias totales según nivel de actividad
export function calculateDailyCalories(tmb, activityLevel, goal) {
  const activityMultipliers = {
    sedentary: 1.2,      // Poco o ningún ejercicio
    light: 1.375,        // Ejercicio ligero 1-3 días/semana
    moderate: 1.55,      // Ejercicio moderado 3-5 días/semana
    active: 1.725,       // Ejercicio intenso 6-7 días/semana
    very_active: 1.9     // Ejercicio muy intenso, trabajo físico
  }
  
  let calories = tmb * (activityMultipliers[activityLevel] || 1.55)
  
  // Ajustar según objetivo
  if (goal === 'lose_weight') {
    calories -= 500 // Déficit de 500 cal para perder ~0.5kg/semana
  } else if (goal === 'gain_muscle') {
    calories += 300 // Superávit de 300 cal para ganar músculo
  }
  // Si es 'maintain' o 'improve_health', se queda igual
  
  return Math.round(calories)
}

// Calcular distribución de macronutrientes (en gramos)
export function calculateMacros(dailyCalories, goal) {
  let proteinPercent, carbsPercent, fatPercent
  
  switch(goal) {
    case 'lose_weight':
      proteinPercent = 0.35  // 35% proteína (para preservar músculo)
      carbsPercent = 0.30    // 30% carbohidratos
      fatPercent = 0.35      // 35% grasas
      break
      
    case 'gain_muscle':
      proteinPercent = 0.30  // 30% proteína
      carbsPercent = 0.45    // 45% carbohidratos (más energía)
      fatPercent = 0.25      // 25% grasas
      break
      
    case 'maintain':
    case 'improve_health':
    default:
      proteinPercent = 0.25  // 25% proteína
      carbsPercent = 0.45    // 45% carbohidratos
      fatPercent = 0.30      // 30% grasas
  }
  
  // Convertir porcentajes a gramos
  // Proteína y carbos: 4 calorías por gramo
  // Grasas: 9 calorías por gramo
  const protein = Math.round((dailyCalories * proteinPercent) / 4)
  const carbs = Math.round((dailyCalories * carbsPercent) / 4)
  const fat = Math.round((dailyCalories * fatPercent) / 9)
  
  return { protein, carbs, fat }
}

// Calcular plan nutricional completo
export function calculateNutritionPlan(profile) {
  const { age, gender, weight, height, activity_level, goal } = profile
  
  // 1. Calcular TMB
  const tmb = calculateTMB(weight, height, age, gender)
  
  // 2. Calcular calorías diarias
  const dailyCalories = calculateDailyCalories(tmb, activity_level, goal)
  
  // 3. Calcular macros
  const macros = calculateMacros(dailyCalories, goal)
  
  // 4. Distribuir calorías por comida
  const mealsDistribution = {
    breakfast: Math.round(dailyCalories * 0.25),  // 25%
    lunch: Math.round(dailyCalories * 0.35),      // 35%
    dinner: Math.round(dailyCalories * 0.30),     // 30%
    snacks: Math.round(dailyCalories * 0.10)      // 10%
  }
  
  return {
    tmb: Math.round(tmb),
    dailyCalories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    mealsDistribution
  }
}

// Generar recomendaciones de recetas según perfil
export function generateMealRecommendations(profile, recipes) {
  const { goal, dietary_preference, allergies } = profile
  const caloriesPerMeal = {
    breakfast: Math.round(profile.daily_calories_target * 0.25),
    lunch: Math.round(profile.daily_calories_target * 0.35),
    dinner: Math.round(profile.daily_calories_target * 0.30),
    snack: Math.round(profile.daily_calories_target * 0.10)
  }
  
  const recommendations = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  }
  
  // Filtrar recetas según preferencias
  let filteredRecipes = recipes.filter(recipe => {
    // Filtro por dieta
    if (dietary_preference === 'vegetarian' && !recipe.is_vegetarian) return false
    if (dietary_preference === 'vegan' && !recipe.is_vegan) return false
    // Agregar más filtros según necesites
    
    return true
  })
  
  // Seleccionar recetas por tipo de comida
  for (let mealType of ['breakfast', 'lunch', 'dinner', 'snack']) {
    const mealRecipes = filteredRecipes.filter(r => r.meal_type === mealType)
    
    // Ordenar por cercanía a calorías objetivo
    const sorted = mealRecipes.sort((a, b) => {
      const diffA = Math.abs(a.total_calories - caloriesPerMeal[mealType])
      const diffB = Math.abs(b.total_calories - caloriesPerMeal[mealType])
      return diffA - diffB
    })
    
    // Tomar las 3-5 mejores opciones
    const key = mealType === 'snack' ? 'snacks' : mealType
    recommendations[key] = sorted.slice(0, 5)
  }
  
  return recommendations
}

export default {
  calculateTMB,
  calculateDailyCalories,
  calculateMacros,
  calculateNutritionPlan,
  generateMealRecommendations
}