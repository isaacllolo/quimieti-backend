// Importa las dependencias necesarias
import jwt from 'jsonwebtoken';

// Controlador para obtener el nombre de usuario en sesión
const getUserName = async (req, res) => {
  // Verifica si existe la cookie con el token
  const token = req.session.user;

  if (!token) {
    return res.status(401).json({ mensaje: 'No se encontró el token en la cookie' });
  }

  try {
    // Verifica y decodifica el token

    // Extrae el userId del token

    // Aquí deberías tener lógica para obtener el nombre de usuario desde tu base de datos
    // Por ejemplo, supongamos que tienes una función en tu base de datos que hace esto:
    // const userName = await obtenerNombreDeUsuarioDesdeBD(userId);

    // En este ejemplo, supondrémos que el nombre de usuario es directamente el userId
    const userName = req.session.user.usuario ;

    res.setHeader('Access-Control-Allow-Methods', 'GET');
    return res.status(200).json({ usuario:userName });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ mensaje: 'Token inválido', error: error.message });
  }
};

// Exporta el controlador
export default { ruta: '/getuser', metodo: 'get', controlador: getUserName };
