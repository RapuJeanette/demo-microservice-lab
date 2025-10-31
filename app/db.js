import pg from 'pg';

const { Pool } = pg;

// Configuración de la conexión con PostgreSQL
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'db',
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin123',
  database: process.env.DATABASE_NAME || 'clientes_db',
});

// Inicializar base de datos
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Base de datos inicializada');
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err);
    process.exit(1);
  }
};

initDB();

export default pool;

