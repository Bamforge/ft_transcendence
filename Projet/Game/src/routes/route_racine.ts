import { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

/**
* Route GET /hello
* Retourne un objet JSON simple pour tester le serveur.
* @param request - Requête HTTP entrante
* @param reply - Réponse HTTP sortante
*/
export const route_racine = 
{
		method: 'GET',
		url: '/',
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			reply.redirect("/home");
		},
}
