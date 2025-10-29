// Calcular nivel basado en puntos
export function calculateLevel(totalPoints) {
  return Math.floor(totalPoints / 100) + 1
}

// Calcular progreso al siguiente nivel
export function calculateLevelProgress(totalPoints) {
  const currentLevelPoints = totalPoints % 100
  return {
    current: currentLevelPoints,
    total: 100,
    percentage: currentLevelPoints
  }
}

// Obtener título según nivel
export function getLevelTitle(level) {
  if (level >= 51) return 'Leyenda del Fitness'
  if (level >= 31) return 'Experto'
  if (level >= 16) return 'Atleta'
  if (level >= 6) return 'Entusiasta'
  return 'Principiante'
}

// Formatear fecha
export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Verificar si hoy ya completó un hábito
export function isCompletedToday(completions, habitId) {
  const today = new Date().toISOString().split('T')[0]
  return completions.some(c => {
    const completedDate = new Date(c.completed_at).toISOString().split('T')[0]
    return c.habit_id === habitId && completedDate === today
  })
}

// Validar email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar password (mínimo 6 caracteres)
export function isValidPassword(password) {
  return password && password.length >= 6
}

export default {
  calculateLevel,
  calculateLevelProgress,
  getLevelTitle,
  formatDate,
  isCompletedToday,
  isValidEmail,
  isValidPassword
}
