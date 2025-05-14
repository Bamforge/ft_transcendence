import fastify, { FastifyBaseLogger, FastifyInstance, FastifyTypeProvider, RawServerDefault } from 'fastify';
import fastifyView from "@fastify/view";
import fastifyStatic from '@fastify/static';
import path, { resolve } from 'path';
import sqlite3 from 'sqlite3';
import { routes } from "./routes/routes";
import GetDatabase, { InitDatabase } from './db_gestion/db_creation';
import { readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * Instance principale de Fastify pour gérer le serveur HTTP.
 */
const app: FastifyInstance = fastify({
	logger: true,
	caseSensitive: false,
	ignoreTrailingSlash: true,
});


// Register plugins
app.register(fastifyView, {
	engine: {
		ejs: require("ejs")
	},
	root: path.join(__dirname, '../public/ejs_files'),
	viewExt: 'ejs', 
});

/**
 * Sert les fichiers statiques depuis le dossier /public.
*/
app.register(fastifyStatic, {
	root: path.join(__dirname, '../public'),
	prefix: '/',
});

// get Database setup
const dbPromise = GetDatabase();
InitDatabase(dbPromise);

// Add all routes from routes.ts
routes.forEach((route) => {
	app.route(route);
});

/**
 * Gestion du signal SIGINT (Ctrl+C) pour fermer proprement la base de données.
 */
process.on('SIGINT', () => {
	console.log('Closing database connection');
	dbPromise.close((err) => {
		if (err)
			console.error('Error closing database', err);
		else
			console.log('Database connection closed');
		process.exit(0);
	});
});


/**
 * Fonction principale pour démarrer le serveur Fastify.
*/
const start = async () => {
	// Set the Port
	const PORT = process.env.PORT || 3000;

	try {
		// Start the server
		app.listen({ port: Number(PORT), host: '0.0.0.0'}, (err, address) => {
			if (err) {
				app.log.error(err);
				process.exit(1);
			}
			// app.log.info(`Server listening / running at ${address}`);
		});
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

app.setNotFoundHandler((req, reply) => {
	reply.redirect("/404");
});

start();

