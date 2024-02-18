import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import obtenerInformacionTemaController from './controllers/temasController.js';
import obtenerInformacionLeccionController from './controllers/leccionesController.js';
import marcarLeccionComoCompletadaController from './controllers/progresoController.js';
import Login from './controllers/Login.js';
import Register from './controllers/Register.js';
import getUserName from './controllers/gestUser.js';
import obtenerInformacionDelTema from './controllers/courseController.js';
import logout from './controllers/LogOut.js';
import verifyToken from './controllers/verifyTokenController.js';
import completarLeccion from './controllers/Quiz.js';
import * as adminController from './controllers/AdminController.jsdminController.js';

import dotenv from 'dotenv';
import webpush from 'web-push'; 
import morgan  from "morgan";
import session from './storage.js';
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
    sameSite: 'strict',
}));
app.set('trust proxy', 1);
app.use(session.config); 
app.use(morgan("dev"));
app.use(express.static('public'));
app.use(cookieParser());  // Usa cookie-parser para gestionar cookies




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));



app.use('/login', Login.controlador);
app.use('/register', Register.controlador);
app.use('/temas', obtenerInformacionTemaController.controlador);
app.use('/slides/:id', obtenerInformacionLeccionController.controlador);
app.use('/progreso', marcarLeccionComoCompletadaController.controlador);
app.use('/course/:temaId', obtenerInformacionDelTema.controlador);
app.use('/logout', logout.controlador);
app.use('/getuser', getUserName.controlador);
app.use('/verify-token', verifyToken.controlador); 
app.use('/quiz/:lessonId', completarLeccion.controlador);
app.use('/admin', adminController.obtenerDatosAdmin);
app.use('/admin/temas', adminController.agregarTema);
app.use('/admin/temas/:id', adminController.editarTema);
app.use('/admin/temas/:id', adminController.eliminarTema);
app.use('/admin/lecciones', adminController.agregarLeccion);
app.use('/admin/lecciones/:id', adminController.editarLeccion);
app.use('/admin/lecciones/:id', adminController.eliminarLeccion);
app.use('/admin/quizzes', adminController.agregarQuiz);
app.use('/admin/quizzes/:id', adminController.editarQuiz);
app.use('/admin/quizzes/:id', adminController.eliminarQuiz);
app.use('/admin/slides', adminController.agregarSlide);
app.use('/admin/slides/:id', adminController.editarSlide);
app.use('/admin/slides/:id', adminController.eliminarSlide);

