// controllers/progresoUsuarioLeccionesController.js
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const completarLeccion = async (req, res) => {
    try {
        const token = req.headers.cookie.split('token=')[1];
        const decoded = jwt.verify(token, 'elpepe');
        const userId = decoded.userId;
        const leccionId  = req.params.lessonId;
        console.log('UserId:', userId); 
    console.log('LeccionId:', leccionId);
    const temaResult = await pool.query('SELECT id_tema FROM lecciones WHERE id = $1', [leccionId]);
    const temaId = temaResult.rows[0].id_tema;
        // Verifica si el usuario ya completó esta lección
        const progresoLeccion = await pool.query(
          'SELECT * FROM progreso_usuario WHERE id_usuario = $1 AND id_leccion = $2 AND completado = true',
          [userId, leccionId]
        );
    
        if (progresoLeccion.rows.length > 0) {
          return res.status(400).json({ mensaje: 'El usuario ya completó esta lección' });
        }
        else  {
          // Si la lección no está en progreso_usuario, agrégala
          await pool.query('INSERT INTO progreso_usuario (id_usuario, id_leccion, id_tema, completado) VALUES ($1, $2, $3, true)', [userId, leccionId, temaId]);
        }
    
        // Inserta el registro de progreso para la lección completada
        await pool.query('UPDATE progreso_usuario SET completado = true WHERE id_usuario = $1 AND id_leccion = $2', [userId, leccionId]);
    
        // Obtiene los datos del quiz asociado a la lección
        const quizResult = await pool.query('SELECT * FROM quizzes WHERE id_leccion = $1', [leccionId]);
        const quizData = quizResult.rows[0];
        console.log('QuizData:', quizResult.rows[0]);
        res.status(200).json({ mensaje: 'Lección marcada como completada exitosamente', quiz: quizData });
      } catch (error) {
        console.error('Error al marcar la lección como completada y obtener datos del quiz:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
      }
};

export default { ruta: '/quiz/:lessonId', metodo: 'post', controlador: completarLeccion };
