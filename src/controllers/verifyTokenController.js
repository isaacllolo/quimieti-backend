// controllers/verifyTokenController.js
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const verifyToken = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    console.log( 'HEADERS: ',req.headers);
    console.log( 'COOKIES: ',req.cookies);
    console.log( 'BODY: ',req.body);
    const token = req.headers.cookie.split('token=')[1];
    console.log('Token:', token); 

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        console.log('Decoded:', decoded);

        const userResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.userId]);
       // console.log('User Result:', userResult.rows);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.status(200).json({ mensaje: 'Token válido',status: "success" , usuario: userResult.rows[0].usuario } );
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ mensaje: 'Token inválido', error: error.message });
    }
};

export default { ruta: '/verify-token', metodo: 'post', controlador: verifyToken };
