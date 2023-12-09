// controllers/leccionesController.js
/**
 * @param {Request} req
 * @param {Response} res
 */
const obtenerInformacionSlidesPorLeccion = async (req, res) => {
  const { pool } = await import('../db.js');

  try {
    console.log('Recibiendo solicitud de información de slides por lección:', req.params.id);
    const  Id  = req.params.id;
    console.log('ID de la lección:', req.params.id);
    const result = await pool.query('SELECT * FROM slides WHERE leccion_id = $1', [Id]);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    if (result.rows && result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ mensaje: 'Slides no encontradas para la lección especificada' });
    }
  } catch (error) {
    console.error('Error al obtener información de las slides:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default { ruta: '/slides/:id', metodo: 'get', controlador: obtenerInformacionSlidesPorLeccion };
