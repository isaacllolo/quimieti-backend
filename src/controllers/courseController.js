// controllers/courseController.js
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

const obtenerInformacionDelTema = async (req, res) => {
  try {
    console.log('Recibiendo solicitud de información del tema:', req.headers.cookie);
    console.log('USERID',req.session.user.id);
    console.log('PARAMETROS:', req.params);
    console.log('TemaID:', req.params.temaId)
    const temaId  = req.params.temaId;
    const userId = req.session.user.id;
    console.log('User ID:', userId);
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
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Devolver información del tema y lecciones
    res.status(200).json({ tema, lecciones });
  } catch (error) {
    console.error('Error al obtener información del tema y lecciones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default { ruta: '/course/:temaId', metodo: 'get', controlador: obtenerInformacionDelTema };
