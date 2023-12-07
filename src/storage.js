import session from 'express-session';
const KnexSessionStore = require('connect-session-knex')(session);
import Knex from 'knex';
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

  const store = new KnexSessionStore({
	knex,
	tablename: 'session',
  });

const config =session({
	key: 'jsessionid',
	secret: process.env.SESSION_SECRET,
	store,
	resave: true,
	saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
		sameSite: 'none',
		secure: true,
    }
})

export default { config };
