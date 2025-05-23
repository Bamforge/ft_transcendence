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
import getDbAsync from './controllers/initDb.js';
import addUserInDb from './controllers/dbUtils/addUser.js';
import { addUser } from './interface/users.js';

/**
 *
 */
// Get __dirname equivalent in ES modules
const  __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 *
 */
dotenv.config();

/**
 *
 */
const fastify = Fastify({
	logger: true,
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
const dbAsync = getDbAsync();

fastify.listen({port: Number(PORT)}, async (err, address) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		const newU : addUser = { username : "BOB"};
		const db = await dbAsync;
		addUserInDb(db, "bob", newU)
		fastify.log.info(`Server listening at ${address}`);
	}
);

process.on('SIGINT', async () => {
	const db = await dbAsync;
	await db.close();
	process.exit(0);
});
