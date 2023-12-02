// authMiddleware.js
const requireAuth = (req, res, next) => {
    if (req.session.user) {
      // El usuario está autenticado, permite el acceso a la ruta
      next();
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión
      res.redirect('/login');
    }
  };
  
  export default requireAuth;
  