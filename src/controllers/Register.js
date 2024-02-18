// controllers/registerController.js
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const Register = async (req, res) => {
  console.log('Recibiendo solicitud de registro:', req.body);
  const nombre = req.body.name;
  const email = req.body.email;
  const contrasena = req.body.password;
  const apellido = req.body.apellidos
  const usuario = req.body.user
  try {
    // Validar campos
    if (!usuario || !email || !nombre || !apellido || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    if (contrasena.length < 8) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Validar formato de email y nombre/apellidos (ajustar según tus necesidades)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const nombreApellidoRegex = /^[a-zA-Z ]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ mensaje: 'El correo no es válido' });
    }

    if (!nombreApellidoRegex.test(nombre)) {
      return res.status(400).json({ mensaje: 'El nombre no es válido' });
    }

    if (!nombreApellidoRegex.test(apellido)) {
      return res.status(400).json({ mensaje: 'Los apellidos no son válidos' });
    }

    // Insertar nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (usuario, email, nombre, apellido, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [usuario, email, nombre, apellido, contrasena]
    );

    const newUser = result.rows[0];
    delete newUser.contrasena;


    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar nuevo usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default { ruta: '/register', metodo: 'post', controlador: Register };
