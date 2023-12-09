// Importa las dependencias necesarias
import jwt from 'jsonwebtoken';

// Controlador para obtener el nombre de usuario en sesión
const getUserName = async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ mensaje: 'No se encontró el token en la cookie' });
  }

  try {
  
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
