// Importa las dependencias necesarias
import jwt from 'jsonwebtoken';

// Controlador para obtener el nombre de usuario en sesión
const getUserName = async (req, res) => {
  // Verifica si existe la cookie con el token
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ mensaje: 'No se encontró el token en la cookie' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);

    // Extrae el userId del token
    const userId = decoded.userId;

    // Aquí deberías tener lógica para obtener el nombre de usuario desde tu base de datos
    // Por ejemplo, supongamos que tienes una función en tu base de datos que hace esto:
    // const userName = await obtenerNombreDeUsuarioDesdeBD(userId);

    // En este ejemplo, supondrémos que el nombre de usuario es directamente el userId
    const userName = userId;

    res.setHeader('Access-Control-Allow-Methods', 'GET');
    return res.status(200).json({ userName });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ mensaje: 'Token inválido', error: error.message });
  }
};

// Exporta el controlador
export default { ruta: '/get-user-name', metodo: 'get', controlador: getUserName };
