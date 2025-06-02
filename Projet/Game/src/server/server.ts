/**
 *
 */
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import { routes } from './routes/routes.js';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { DbGestion } from './db/dbGestion.js';
import test_transandance from './test/transandance.js';

/**
 *
 */
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 *
 */
dotenv.config();

/**
 *
 */
const fastify = Fastify({
	// logger: true,
	caseSensitive: false,
	ignoreTrailingSlash: true,
});

/**
 *
 */
fastify.register(fastifyFormbody);
fastify.register(fastifyCookie);
fastify.register(fastifyView, {
	engine: {
		ejs: ejs,
	},
	root: join(__dirname, '../views'),
	includeViewExtension: true,
});

/**
 *
 */
fastify.register(fastifyStatic, {
	root: join(__dirname, '../public'),
	prefix: '/public/', // optional: default '/'
});

/**
 *
 */
routes.forEach((route) => {
	fastify.route(route);
});

/**
 *
 */
const PORT = process.env.PORT || 3000;

/**
 *
 */
const db = new DbGestion();

const startServer = async () => {
	try {
		await db.init();

		await test_transandance(db);
	
		const address = await fastify.listen({ port: Number(PORT) });
		console.log(`Server listening at ${address}`);

	} catch (err) {
		await db.closeSecur();
		console.error(chalk.red(`Erreur listen server.`));
		console.error(err);
		process.exit(1);

	}
};

await startServer();

process.on('SIGINT', async () => {
	await db.closeSecur();
	process.exit(0);
});
