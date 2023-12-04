import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Knex from 'knex';
import pgSession from 'connect-pg-simple'; // Importa pgSession desde connect-pg-simple
import obtenerInformacionTemaController from './controllers/temasController.js';
import obtenerInformacionLeccionController from './controllers/leccionesController.js';
import marcarLeccionComoCompletadaController from './controllers/progresoController.js';
import Login from './controllers/Login.js';
import Register from './controllers/Register.js';
import obtenerInformacionDelTema from './controllers/courseController.js';
import logout from './controllers/LogOut.js';
import { pool } from './db.js';
import verifyToken from './controllers/verifyTokenController.js';
import completarLeccion from './controllers/Quiz.js';
import dotenv from 'dotenv';
import webpush from 'web-push'; 
dotenv.config();
webpush.setVapidDetails(
  'mailto:isaacllolo10@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  },
});

const PgSession = pgSession(session); // Crea una instancia de pgSession

const app = express();


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new PgSession({
      pool,
      tableName: 'session',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
);
app.use(cookieParser());  // Usa cookie-parser para gestionar cookies

app.use(cors({
  allowedOrigins: process.env.CORS_ORIGIN,
  origin: process.env.CORS_ORIGIN,
  headers: 'Content-Type, Authorization',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use((req, res, next) => {
res.header('Access-Control-Allow-Origin', 'https://quimieti-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.options('*', cors()); // Esto responde a todas las solicitudes OPTIONS
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
app.use('/verify-token', verifyToken.controlador); 
app.use('/quiz/:lessonId', completarLeccion.controlador);
