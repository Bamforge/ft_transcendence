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
import { addUser, GetUserDataString, User } from './interfaces/users.js';
import chalk from 'chalk';
import { DbGestion } from './db/dbGestion.js';
import { UserRepository } from './repositories/user.repository.js';

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

/**
 *
 */
async function test_tab_user(db: DbGestion)
{
		const tabUserGestion = new UserRepository(db);
		const testname = "BOB";

		if (await tabUserGestion.addUser({ username: testname, password : "a" }) == null)
			console.log(chalk.yellow(`⚠️  Attention, le username : '${testname}' existe déjà, on ne peut pas le rajouter.`));
		else
			console.log(chalk.green(`✅ Ajout du username : '${testname}' dans le tableau users.`));

		const user: User | undefined = await tabUserGestion.getUserById(1);
		console.log(`Le user à id 1 dans la Db : ${GetUserDataString(user)}`);
		if (user != undefined)
		{
			await tabUserGestion.updateUser(user, {username:"Alice", password:"NON", is_bot:false})
			console.log("Update");
		}
}

const startServer = async () => {
	try {
		await db.init();

		await test_tab_user(db);

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
