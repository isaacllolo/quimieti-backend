import session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import Knex from 'knex';
const KnexSessionStoreInstance=KnexSessionStore(session);
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
  const store = new KnexSessionStoreInstance({
	knex,
	tablename: 'session',
  });

const config =session({
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
