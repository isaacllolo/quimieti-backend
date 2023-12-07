import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import obtenerInformacionTemaController from './controllers/temasController.js';
import obtenerInformacionLeccionController from './controllers/leccionesController.js';
import marcarLeccionComoCompletadaController from './controllers/progresoController.js';
import Login from './controllers/Login.js';
import Register from './controllers/Register.js';
import obtenerInformacionDelTema from './controllers/courseController.js';
import logout from './controllers/LogOut.js';
import verifyToken from './controllers/verifyTokenController.js';
import completarLeccion from './controllers/Quiz.js';
import dotenv from 'dotenv';
import webpush from 'web-push'; 
import morgan  from "morgan";
import session from './storage.mjs';
dotenv.config();
webpush.setVapidDetails(
  'mailto:isaacllolo10@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedOrigins: [process.env.CORS_ORIGIN],
    credentials: true,
}));
app.set('trust proxy', 1);
app.use(session);
app.use(morgan("dev"));
app.use(express.static('public'));
app.use(cookieParser());  // Usa cookie-parser para gestionar cookies




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));


app.options('*', cors()); // include before other routes

app.use('/login', Login.controlador);
app.use('/register', Register.controlador);
app.use('/temas', obtenerInformacionTemaController.controlador);
app.use('/slides/:id', obtenerInformacionLeccionController.controlador);
app.use('/progreso', marcarLeccionComoCompletadaController.controlador);
app.use('/course/:temaId', obtenerInformacionDelTema.controlador);
app.use('/logout', logout.controlador);
app.use('/verify-token', verifyToken.controlador); 
app.use('/quiz/:lessonId', completarLeccion.controlador);

