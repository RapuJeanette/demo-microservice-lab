import express from 'express';
import path from 'path';
import pool from './db.js';

const app = express();
app.use(express.json());

app.use(express.static(path.join(path.resolve(), 'public')));

app.get("/", (_req, res)=>{
    // responde con un json que tendra status
    res.json({status: "ok", service: "Hola Microservicio"});
});

app.get('/clientes', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

app.post("/clientes", async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO clientes (nombre, email) VALUES ($1, $2) RETURNING *",
      [nombre, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear cliente" });
  }
});

export default app;