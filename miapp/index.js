import express from 'express';
const mysql = require('mysql');
const app = express();
const PORT = 3000;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'users'
  });


  // Conexión a la base de datos
connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos: ', err);
      return;
    }
    console.log('Conexión exitosa a la base de datos');
  });

  // Ruta para obtener datos de la base de datos
app.get('/usuarios', (req, res) => {
     connection.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios: ', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      res.json(results);
    });
  });
  

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
  });

  // Ruta para agregar un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ mensaje: 'Nombre y email son campos requeridos' });
    }
  
    const nuevoUsuario = { nombre, email };
    connection.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err, result) => {
      if (err) {
        console.error('Error al agregar usuario: ', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      res.status(201).json({ mensaje: 'Usuario agregado correctamente', id: result.insertId });
    });
  });
  
  // Ruta para actualizar un usuario existente
  app.put('/usuarios/:id', (req, res) => {
    const { nombre, email } = req.body;
    const { id } = req.params;
    if (!nombre && !email) {
      return res.status(400).json({ mensaje: 'Se requiere al menos un campo para actualizar' });
    }
  
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (email) datosActualizados.email = email;
  
    connection.query('UPDATE usuarios SET ? WHERE id = ?', [datosActualizados, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar usuario: ', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
        return;
      }
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    });
  });
  
  // Ruta para eliminar un usuario existente
  app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM usuarios WHERE id = ?', id, (err, result) => {
      if (err) {
        console.error('Error al eliminar usuario: ', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
        return;
      }
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    });
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});