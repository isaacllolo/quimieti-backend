// controllers/temasController.js
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const obtenerInformacionTema = async (req, res) => {
  try {
    const token = req.headers.cookie.split('token=')[1];
    if (!token) {
      return res.status(401).json({ mensaje: 'Token no proporcionado en la cookie' });
    }
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    const userId = decoded.userId;
    console.log('User ID:', userId);
    // Obtener información de los temas y su estado de completado
    const result = await pool.query('SELECT t.*, CASE WHEN COUNT(l.id) = SUM(CAST(p.completado AS INT)) THEN true ELSE false END AS completado FROM temas t LEFT JOIN lecciones l ON t.id = l.id_tema LEFT JOIN progreso_usuario p ON l.id = p.id_leccion AND p.id_usuario = $1 GROUP BY t.id ORDER BY t.id', [userId]);

    const temas = result.rows;

    if (temas && temas.length > 0) {
      res.status(200).json(temas);
    } else {
      res.status(404).json({ mensaje: 'No hay temas disponibles' });
    }
  } catch (error) {
    console.error('Error al obtener información del tema:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default { ruta: '/temas', metodo: 'get', controlador: obtenerInformacionTema };
