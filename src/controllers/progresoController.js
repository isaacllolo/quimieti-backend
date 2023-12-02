// controllers/progresoController.js

const marcarLeccionComoCompletada = async (req, res) => {
  const { sql } = await import('../db.js');

  try {
    const { usuarioId, leccionId } = req.params;

    // Verificar si la lección está en progreso_usuario
    const resultadoVerificacion = await sql`
      SELECT * FROM progreso_usuario WHERE id_usuario = ${usuarioId} AND id_leccion = ${leccionId}
    `;

    if (resultadoVerificacion.length === 0) {
      // Si la lección no está en progreso_usuario, agrégala
      await sql`
        INSERT INTO progreso_usuario (id_usuario, id_leccion, completado) VALUES (${usuarioId}, ${leccionId}, true)
      `;
    } else {
      // Si la lección ya está en progreso_usuario, simplemente márcala como completada
      await sql`
        UPDATE progreso_usuario SET completado = true WHERE id_usuario = ${usuarioId} AND id_leccion = ${leccionId}
      `;
    }

    res.status(200).json({ mensaje: 'Lección marcada como completada' });
  } catch (error) {
    console.error('Error al marcar la lección como completada:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export default { ruta: '/progreso/:usuarioId/:leccionId', metodo: 'put', controlador: marcarLeccionComoCompletada };
