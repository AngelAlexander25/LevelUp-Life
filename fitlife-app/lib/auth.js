import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'

// Generar token JWT
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  })
}

// Verificar token JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return null
  }
}

// Hash de password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// Comparar password
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

// Obtener userId del request (desde header Authorization)
export function getAuthUserId(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7) // Remover "Bearer "
    const decoded = verifyToken(token)
    
    return decoded ? decoded.userId : null
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

// Middleware para proteger rutas (usar en API routes)
export function requireAuth(handler) {
  return async (request, context) => {
    const userId = getAuthUserId(request)
    
    if (!userId) {
      return Response.json(
        { error: 'No autorizado. Token inválido o expirado.' },
        { status: 401 }
      )
    }
    
    // Agregar userId al request para usarlo en el handler
    request.userId = userId
    
    return handler(request, context)
  }
}

export default {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  getAuthUserId,
  requireAuth
}