// LogoutController.js

/**
 * @param {Request} req
 * @param {Response} res
 */

// Ruta para cerrar sesión
const logout = async (req, res) => {
  try {
    req.session.destroy();
    return res.json({ status: "success" });
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export default { ruta: '/logout', metodo: 'post', controlador: logout };
