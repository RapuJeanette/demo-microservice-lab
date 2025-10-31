import pkg from 'pg';
const { Pool } = pkg;

// Configuración de la conexión con PostgreSQL usando variables de entorno
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'db', // db es el nombre del servicio en docker-compose
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin123',
  database: process.env.DATABASE_NAME || 'clientes_db',
});

// Función para inicializar la base de datos y crear la tabla si no existe
const initDB = async () => {
  try {
    await pool.connect();
    console.log('Conectado a PostgreSQL');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    console.log('Tabla "clientes" creada o ya existente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }
};

// Inicializar base de datos al importar el módulo
initDB();

module.exports = pool;
