import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import path, { dirname, extname, resolve } from "path";
import sqlite3 from "sqlite3";
import { existsSync, readFileSync } from "fs";


const app: FastifyInstance = fastify({ logger: true });

app.get("/hello", async (request, reply) => {
  reply.send({ hello: "world modified" });
});

// Serve static files (including canvas.js) from /public
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

/* Obsolete si c'est dans public
// Route générique pour CSS
app.get('/css/:file', async (req: FastifyRequest<{ Params: { file: string } }>, reply) => {
	console.log(`Essaye de recuperer un fchier dans ./css.`);
	const file = req.params.file;
	const fileExtension = extname(file);
	const filePath = resolve(__dirname, `../css/${file}`);
  
	if (!existsSync(filePath))
		return reply.status(404).send('Fichier CSS non trouvé');
	else if (fileExtension !== '.css') 
		return reply.status(400).send('Type de fichier non autorisé. Seuls les fichiers .css sont acceptés.');

	try
	{
		const css = readFileSync(filePath, 'utf8');
		reply.type('text/css').send(css);
	} catch (error) {
		console.error(`Erreur lors de la lecture du fichier CSS ${file}:`, error);
		reply.status(500).send('Erreur serveur lors de la lecture du fichier CSS');
	}
});

app.get('/dist/:file', async (req: FastifyRequest<{ Params: { file: string } }>, reply) => {
	console.log(`Essaye de recuperer un fchier dans le dossier ./dist`);
	
	const file = req.params.file;
	const fileExtension = extname(file);
	const filePath = resolve(__dirname, `./${file}`);

	if (!existsSync(filePath))
		return reply.status(404).send('Fichier JavaScript non trouvé');
	else if (fileExtension !== '.js') 
		return reply.status(400).send('Type de fichier non autorisé. Seuls les fichiers .js sont acceptés.');

	try {
		const js = readFileSync(filePath, 'utf8');
		reply.type('application/javascript').send(js);
	} catch (error) {
		console.error(`Erreur lors de la lecture du fichier JavaScript ${file}:`, error);
		reply.status(500).send('Erreur serveur lors de la lecture du fichier JavaScript');
	}
});
*/
  /**
 *
 *   DATATABASE TEST
 *
 */


const db = new sqlite3.Database(path.join(__dirname, '../db/data.sqlite'), (err) => {
  if (err) {
    console.error('Failed to open database', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

db.run(
  `CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

app.get('/api/visit', async () =>
  new Promise((resolve, reject) => {
    db.run('INSERT INTO visits DEFAULT VALUES', function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  })
);

app.get('/api/visits', async () =>
  new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) AS count FROM visits', (err, row: { count: number }) => {
      if (err) return reject(err);
      resolve({ visits: row.count });
    });
  })
);

/***
 *
 *  END OF DATABASE TEST
 *
 */


const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0'  });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();


