import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Knex from 'knex';
import pgSession from 'connect-pg-simple'; // Importa pgSession desde connect-pg-simple
import obtenerInformacionTemaController from '../controllers/temasController.js';
import obtenerInformacionLeccionController from '../controllers/leccionesController.js';
import marcarLeccionComoCompletadaController from '../controllers/progresoController.js';
import Login from '../controllers/Login.js';
import Register from '../controllers/Register.js';
import obtenerInformacionDelTema from '../controllers/courseController.js';
import logout from '../controllers/LogOut.js';
import { pool } from '../db.js';
import verifyToken from '../controllers/verifyTokenController.js';
import completarLeccion from '../controllers/Quiz.js';
const knex = Knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'Quimieti',
    port: 5432,
  },
});

const PgSession = pgSession(session); // Crea una instancia de pgSession

const app = express();


app.use(
  session({
    secret: 'elpepe',
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
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


app.options('*', cors()); // Esto responde a todas las solicitudes OPTIONS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
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

