/**
 * @param {Request} req
 * @param {Response} res
 */
const Register = async (req, res) => {
  const { email, nombre, apellido, contrasena } = req.body;
  const { sql } = await import('../db.js');

  try {
    // Validar campos
    if (!email || !nombre || !apellido || !contrasena) {
      return res.status(400).send('Todos los campos son obligatorios');
    }

    if (contrasena.length < 8) {
      return res
        .status(400)
        .send('La contraseña debe tener al menos 8 caracteres');
    }

    // Validar formato de email y nombre/apellidos (puedes ajustar estas expresiones regulares según tus necesidades)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const nombreApellidoRegex = /^[a-zA-Z ]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).send('El correo no es válido');
    }

    if (!nombreApellidoRegex.test(nombre)) {
      return res.status(400).send('El nombre no es válido');
    }

    if (!nombreApellidoRegex.test(apellido)) {
      return res.status(400).send('Los apellidos no son válidos');
    }

    // Insertar nuevo usuario en la base de datos
    await sql`INSERT INTO usuarios (email, nombre, apellido, contrasena) VALUES (${email}, ${nombre}, ${apellido}, ${contrasena})`;

    res.send('Usuario registrado exitosamente');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error interno del servidor');
  }
};

export default {ruta: '/register', metodo: 'post', controlador: Register };
