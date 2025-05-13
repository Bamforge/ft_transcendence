import { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import GetDatabase from './../db_gestion/db_creation';

// get Database setup
const dbPromise = GetDatabase();

/**
 * Route GET /api/visit
 * Insère une nouvelle visite dans la base de données.
 * Retourne l'id de la visite insérée.
 */
export const route_visit = 
{
	method: 'GET',
	url: '/api/visit',
	handler:  async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const result = await new Promise<{ id: number }>((resolve, reject) => {
				dbPromise.run('INSERT INTO visits DEFAULT VALUES', function (err) {
					if (err) return reject(err);
					resolve({ id: this.lastID });
				});
			});
			reply.send(result);
		} catch (err) {
			reply.status(500).send({ error: 'Erreur lors de l\'insertion' });
		}
	}
}

/**
 * Route GET /api/visits
 * Retourne le nombre total de visites enregistrées dans la base de données.
 */
export const route_visits = 
{
	method: 'GET',
	url: '/api/visits',
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		try
		{
			const result = await new Promise<{ visits: number }>((resolve, reject) => {
				dbPromise.get('SELECT COUNT(*) AS count FROM visits', (err, row: { count: number }) => {
					if (err) return reject(err);
					resolve({ visits: row.count });
				});
			})
			reply.send(result);
		} catch (err) {
			reply.status(500).send({ error: 'Erreur lors de l\'insertion' });
		}
	},
}