const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

//* Crear un registro
app.post('/api/usuarios', (request, response) => {
  const { nombre, ciudad, cedula, correo } = request.body;
  
  // Validación de campos obligatorios
  if (!nombre || !ciudad || !cedula || !correo) {
    return response.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = `INSERT INTO usuario (nombre, ciudad, cedula, correo) VALUES (?, ?, ?, ?)`;
  db.query(sql, [nombre, ciudad, cedula, correo], (err, result) => {
    if (err) {
      console.error("Error al agregar el usuario:", err);
      return response.status(500).send('Error al agregar el usuario');
    }
    response.status(201).send('Usuario agregado');
  });
});

//* Leer todos los registros
app.get('/api/usuarios', (request, response) => {
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return response.status(500).send('Error al obtener usuarios');
    }
    response.json(results);
  });
});

//* Leer un solo registro por ID
app.get('/api/usuarios/:id', (request, response) => {
  const { id } = request.params;

  db.query('SELECT * FROM usuario WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      return response.status(500).send('Error al obtener el usuario');
    }
    if (results.length === 0) {
      return response.status(404).send('Usuario no encontrado');
    }
    response.json(results[0]);
  });
});

//* Actualizar un registro
app.put('/api/usuarios/:id', (request, response) => {
  const { id } = request.params;
  const { nombre, ciudad, cedula, correo } = request.body;

  // Validación de campos obligatorios
  if (!nombre || !ciudad || !cedula || !correo) {
    return response.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = `UPDATE usuario SET nombre = ?, ciudad = ?, cedula = ?, correo = ? WHERE id = ?`;

  db.query(sql, [nombre, ciudad, cedula, correo, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar el usuario:", err);
      return response.status(500).send('Error al actualizar el usuario');
    }

    if (result.affectedRows === 0) {
      return response.status(404).send('Usuario no encontrado');
    }

    response.send({ message: 'Usuario actualizado', id: id });
  });
});

//* Eliminar un registro
app.delete('/api/usuarios/:id', (request, response) => {
  const { id } = request.params;

  db.query('DELETE FROM usuario WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar el usuario:", err);
      return response.status(500).send('Error al eliminar el usuario');
    }

    if (result.affectedRows === 0) {
      return response.status(404).send('Usuario no encontrado');
    }

    response.send('Usuario eliminado');
  });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Servidor en el puerto http://localhost:${PORT}`);
});
