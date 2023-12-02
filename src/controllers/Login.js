/**
 * @param {Request} req
 * @param {Response} res
 */
import jwt from 'jsonwebtoken';


const Login = async (req, res) => {
    const { pool } = await import('../db.js');
    
    console.log('Recibiendo solicitud de inicio de sesión:', req.body);
    
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
        return res.status(400).send('Faltan datos de usuario o contraseña');
    }

    try {
        console.log(req.body);
        const userResult = await pool.query(`
            SELECT * FROM usuarios 
            WHERE usuario = $1 AND contrasena = $2`, [usuario, contrasena]);

        const user = userResult.rows;

        if (user.length > 0) {
            // No envíes la contraseña en la respuesta
            delete user[0].contrasena;
            const token = jwt.sign({ userId: user[0].id }, 'elpepe', { expiresIn: '1h' });
            req.session.user = user[0];
            return res.json({ ...user[0], status: "success",token: token });
        }

        return res.status(401).send("Usuario o contraseña incorrectos");
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        return res.status(500).send("Error del servidor");
    }
}

export default { ruta: '/login', metodo: 'post', controlador: Login };
