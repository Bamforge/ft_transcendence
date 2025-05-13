import { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

export const route_about = 
{
		method: 'GET',
		url: '/about',
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			const filePath = resolve(__dirname, '../../public/html/about.html');
			const html = readFileSync(filePath, 'utf8');
			return reply.type('text/html').send(html);
		},
}
