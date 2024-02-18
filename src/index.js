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
import obtenerDatosAdmin from './controllers/AdminController.js';
import agregarTema from './controllers/AdminController.js';
import editarTema from './controllers/AdminController.js';
import eliminarTema from './controllers/AdminController.js';
import agregarLeccion from './controllers/AdminController.js';
import editarLeccion from './controllers/AdminController.js';
import eliminarLeccion from './controllers/AdminController.js';
import agregarQuiz from './controllers/AdminController.js';
import editarQuiz from './controllers/AdminController.js';
import eliminarQuiz from './controllers/AdminController.js';
import agregarSlide from './controllers/AdminController.js';
import editarSlide from './controllers/AdminController.js';
import eliminarSlide from './controllers/AdminController.js';
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
app.use('/admin', obtenerDatosAdmin.controlador);
app.use('/admin/temas', agregarTema.controlador);
app.use('/admin/temas/:id', editarTema.controlador);
app.use('/admin/temas/:id', eliminarTema.controlador);
app.use('/admin/lecciones', agregarLeccion.controlador);
app.use('/admin/lecciones/:id', editarLeccion.controlador);
app.use('/admin/lecciones/:id', eliminarLeccion.controlador);
app.use('/admin/quizzes', agregarQuiz.controlador);
app.use('/admin/quizzes/:id', editarQuiz.controlador);
app.use('/admin/quizzes/:id', eliminarQuiz.controlador);
app.use('/admin/slides', agregarSlide.controlador);
app.use('/admin/slides/:id', editarSlide.controlador);
app.use('/admin/slides/:id', eliminarSlide.controlador);

