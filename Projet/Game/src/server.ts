import fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import sqlite3 from 'sqlite3';

/**
 * Instance principale de Fastify pour gérer le serveur HTTP.
 */
const app: FastifyInstance = fastify({ logger: true });

/**
 * Route GET /hello
 * Retourne un objet JSON simple pour tester le serveur.
 * @param request - Requête HTTP entrante
 * @param reply - Réponse HTTP sortante
 */
app.get('/hello', async (request, reply) => {
  reply.send({ hello: 'world modified' });
});

/**
 * Sert les fichiers statiques depuis le dossier /public.
 */
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

/**
 * Connexion à la base de données SQLite.
 * La base est stockée dans le dossier ../db/data.sqlite.
 */
const db = new sqlite3.Database(path.join(__dirname, '../db/data.sqlite'), (err) => {
  if (err) {
    console.error('Failed to open database', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

/**
 * Création de la table 'visits' si elle n'existe pas.
 * Cette table stocke les visites avec un timestamp.
 */
db.run(
  `CREATE TABLE IF NOT EXISTS visits (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	)`
);

/**
 * Route GET /api/visit
 * Insère une nouvelle visite dans la base de données.
 * Retourne l'id de la visite insérée.
 */
app.get(
  '/api/visit',
  async () =>
    new Promise((resolve, reject) => {
      db.run('INSERT INTO visits DEFAULT VALUES', function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    })
);

/**
 * Route GET /api/visits
 * Retourne le nombre total de visites enregistrées dans la base de données.
 */
app.get(
  '/api/visits',
  async () =>
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS count FROM visits', (err, row: { count: number }) => {
        if (err) return reject(err);
        resolve({ visits: row.count });
      });
    })
);

/***
 *
 *	FIN DU TEST DE BASE DE DONNÉES
 *
 */

/**
 * Fonction principale pour démarrer le serveur Fastify.
 */
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

/**
 * Gestion du signal SIGINT (Ctrl+C) pour fermer proprement la base de données.
 */
process.on('SIGINT', () => {
  console.log('Closing database connection');
  db.close((err) => {
    if (err) {
      console.error('Error closing database', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

start();
