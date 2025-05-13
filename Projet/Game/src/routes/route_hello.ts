import { FastifyRequest, FastifyReply } from 'fastify';

/**
* Route GET /hello
* Retourne un objet JSON simple pour tester le serveur.
* @param request - Requête HTTP entrante
* @param reply - Réponse HTTP sortante
*/
export const route_hello = 
{
		method: 'GET',
		url: '/hello',
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return reply.send({ hello: 'world modified' });
		},
}