import mysql from 'mysql2/promise'

let pool

export function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fitlife_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    })
  }
  return pool
}

// Helper para ejecutar queries
export async function query(sql, params = []) {
  try {
    const connection = getConnection()
    const [results] = await connection.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper para obtener un solo registro
export async function queryOne(sql, params = []) {
  const results = await query(sql, params)
  return results[0] || null
}

export default { getConnection, query, queryOne }