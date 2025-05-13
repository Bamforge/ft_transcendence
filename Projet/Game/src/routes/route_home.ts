import { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

/**
* Route GET /hello
* Retourne un objet JSON simple pour tester le serveur.
* @param request - Requête HTTP entrante
* @param reply - Réponse HTTP sortante
*/
export const route_home = 
{
		method: 'GET',
		url: '/home',
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			const filePath = resolve(__dirname, '../../public/html/index.html');
			const html = readFileSync(filePath, 'utf8');
			return reply.type('text/html').send(html);
		},
}
