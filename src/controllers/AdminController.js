// controllers/adminController.js
import { pool } from '../db.js';

const obtenerDatosAdmin = async (req, res) => {
  try {
    // Obtener temas y sus lecciones, quizzes y slides
    const temasResult = await pool.query('SELECT id, nombre FROM temas');
    const temas = temasResult.rows;

    const temasConLecciones = await Promise.all(
      temas.map(async (tema) => {
        const leccionesResult = await pool.query('SELECT id, title FROM lecciones WHERE id_tema = $1', [tema.id]);
        const lecciones = leccionesResult.rows;

        const leccionesConQuizzesSlides = await Promise.all(
          lecciones.map(async (leccion) => {
            const quizzesResult = await pool.query('SELECT id, question FROM quizzes WHERE id_leccion = $1', [leccion.id]);
            const quizzes = quizzesResult.rows;

            const slidesResult = await pool.query('SELECT id, title FROM slides WHERE leccion_id = $1', [leccion.id]);
            const slides = slidesResult.rows;

            return { ...leccion, quizzes, slides };
          })
        );

        return { ...tema, lecciones: leccionesConQuizzesSlides };
      })
    );

    res.status(200).json({ datosAdmin: temasConLecciones });
  } catch (error) {
    console.error('Error al obtener datos administrativos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const agregarTema = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevoTemaResult = await pool.query('INSERT INTO temas (nombre) VALUES ($1) RETURNING *', [nombre]);
    const nuevoTema = nuevoTemaResult.rows[0];
    res.status(201).json({ mensaje: 'Tema agregado exitosamente', nuevoTema });
  } catch (error) {
    console.error('Error al agregar tema:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const editarTema = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const editarTemaResult = await pool.query('UPDATE temas SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
    const temaEditado = editarTemaResult.rows[0];
    res.json({ mensaje: 'Tema editado exitosamente', temaEditado });
  } catch (error) {
    console.error('Error al editar tema:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const eliminarTema = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminarTemaResult = await pool.query('DELETE FROM temas WHERE id = $1 RETURNING *', [id]);
    const temaEliminado = eliminarTemaResult.rows[0];
    res.json({ mensaje: 'Tema eliminado exitosamente', temaEliminado });
  } catch (error) {
    console.error('Error al eliminar tema:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const agregarLeccion = async (req, res) => {
  try {
    const { id_tema, title, description } = req.body;
    const nuevaLeccionResult = await pool.query(
      'INSERT INTO lecciones (id_tema, title, description) VALUES ($1, $2, $3) RETURNING *',
      [id_tema, title, description]
    );
    const nuevaLeccion = nuevaLeccionResult.rows[0];
    res.status(201).json({ mensaje: 'Lección agregada exitosamente', nuevaLeccion });
  } catch (error) {
    console.error('Error al agregar lección:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const editarLeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const editarLeccionResult = await pool.query(
      'UPDATE lecciones SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    const leccionEditada = editarLeccionResult.rows[0];
    res.json({ mensaje: 'Lección editada exitosamente', leccionEditada });
  } catch (error) {
    console.error('Error al editar lección:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const eliminarLeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminarLeccionResult = await pool.query('DELETE FROM lecciones WHERE id = $1 RETURNING *', [id]);
    const leccionEliminada = eliminarLeccionResult.rows[0];
    res.json({ mensaje: 'Lección eliminada exitosamente', leccionEliminada });
  } catch (error) {
    console.error('Error al eliminar lección:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const agregarQuiz = async (req, res) => {
  try {
    const { id_leccion, question, options, correctAnswerIndex } = req.body;
    const nuevoQuizResult = await pool.query(
      'INSERT INTO quizzes (id_leccion, question, options, correctAnswerIndex) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_leccion, question, options, correctAnswerIndex]
    );
    const nuevoQuiz = nuevoQuizResult.rows[0];
    res.status(201).json({ mensaje: 'Quiz agregado exitosamente', nuevoQuiz });
  } catch (error) {
    console.error('Error al agregar quiz:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const editarQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswerIndex } = req.body;
    const editarQuizResult = await pool.query(
      'UPDATE quizzes SET question = $1, options = $2, correctAnswerIndex = $3 WHERE id = $4 RETURNING *',
      [question, options, correctAnswerIndex, id]
    );
    const quizEditado = editarQuizResult.rows[0];
    res.json({ mensaje: 'Quiz editado exitosamente', quizEditado });
  } catch (error) {
    console.error('Error al editar quiz:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const eliminarQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminarQuizResult = await pool.query('DELETE FROM quizzes WHERE id = $1 RETURNING *', [id]);
    const quizEliminado = eliminarQuizResult.rows[0];
    res.json({ mensaje: 'Quiz eliminado exitosamente', quizEliminado });
  } catch (error) {
    console.error('Error al eliminar quiz:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const agregarSlide = async (req, res) => {
  try {
    const { leccion_id, title, content, image_url } = req.body;
    const nuevoSlideResult = await pool.query(
      'INSERT INTO slides (leccion_id, title, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [leccion_id, title, content, image_url]
    );
    const nuevoSlide = nuevoSlideResult.rows[0];
    res.status(201).json({ mensaje: 'Slide agregado exitosamente', nuevoSlide });
  } catch (error) {
    console.error('Error al agregar slide:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const editarSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;
    const editarSlideResult = await pool.query(
      'UPDATE slides SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *',
      [title, content, image_url, id]
    );
    const slideEditado = editarSlideResult.rows[0];
    res.json({ mensaje: 'Slide editado exitosamente', slideEditado });
  } catch (error) {
    console.error('Error al editar slide:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

const eliminarSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminarSlideResult = await pool.query('DELETE FROM slides WHERE id = $1 RETURNING *', [id]);
    const slideEliminado = eliminarSlideResult.rows[0];
    res.json({ mensaje: 'Slide eliminado exitosamente', slideEliminado });
  } catch (error) {
    console.error('Error al eliminar slide:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default {
  obtenerDatosAdmin: { ruta: '/admin', metodo: 'get', controlador: obtenerDatosAdmin },
  agregarTema: { ruta: '/admin/temas', metodo: 'post', controlador: agregarTema },
  editarTema: { ruta: '/admin/temas/editar/:id', metodo: 'put', controlador: editarTema },
  eliminarTema: { ruta: '/admin/temas/eliminar/:id', metodo: 'delete', controlador: eliminarTema },
  agregarLeccion: { ruta: '/admin/lecciones', metodo: 'post', controlador: agregarLeccion },
  editarLeccion: { ruta: '/admin/lecciones/editar/:id', metodo: 'put', controlador: editarLeccion },
  eliminarLeccion: { ruta: '/admin/lecciones/eliminar/:id', metodo: 'delete', controlador: eliminarLeccion },
  agregarQuiz: { ruta: '/admin/quizzes', metodo: 'post', controlador: agregarQuiz },
  editarQuiz: { ruta: '/admin/quizzes/editar/:id', metodo: 'put', controlador: editarQuiz },
  eliminarQuiz: { ruta: '/admin/quizzes/eliminar/:id', metodo: 'delete', controlador: eliminarQuiz },
  agregarSlide: { ruta: '/admin/slides', metodo: 'post', controlador: agregarSlide },
  editarSlide: { ruta: '/admin/slides/editar/:id', metodo: 'put', controlador: editarSlide },
  eliminarSlide: { ruta: '/admin/slides/eliminar/:id', metodo: 'delete', controlador: eliminarSlide },
  // Agregar rutas, métodos y controladores para otras operaciones si es necesario
};
