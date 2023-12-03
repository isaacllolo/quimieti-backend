// controllers/courseController.js
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

const obtenerInformacionDelTema = async (req, res) => {
  try {
    const { temaId } = req.params;
    const token = req.headers.cookie.split('token=')[1];
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    const userId = decoded.userId;


    // Obtener información del tema
    const temaResult = await pool.query('SELECT * FROM temas WHERE id = $1', [temaId]);
    const tema = temaResult.rows[0];

    if (!tema) {
      return res.status(404).json({ mensaje: 'Tema no encontrado' });
    }

    // Obtener lecciones asociadas al tema con su estado completado
    const leccionesResult = await pool.query(`
      SELECT lecciones.*, 
             progreso_usuario.completado AS completed
      FROM lecciones
      LEFT JOIN progreso_usuario ON lecciones.id = progreso_usuario.id_leccion AND progreso_usuario.id_usuario = $1
      WHERE lecciones.id_tema = $2
      ORDER BY lecciones.id
    `, [userId, temaId]);

    const lecciones = leccionesResult.rows;

    // Devolver información del tema y lecciones
    res.status(200).json({ tema, lecciones });
  } catch (error) {
    console.error('Error al obtener información del tema y lecciones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default { ruta: '/course/:temaId', metodo: 'get', controlador: obtenerInformacionDelTema };
