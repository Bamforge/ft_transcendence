import { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

export const route_404 = 
{
		method: 'GET',
		url: '/404',
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			const filePath = resolve(__dirname, '../../public/html/404.html');
			const html = readFileSync(filePath, 'utf8');
			return reply.type('text/html').send(html);
		},
}
