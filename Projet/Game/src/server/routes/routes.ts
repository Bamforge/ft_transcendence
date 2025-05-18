import { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/view';

export const routes = [
	{
		method: 'GET',
		url: '/',
		handler: async (_: FastifyRequest, reply: FastifyReply) => {
			return reply.view('layouts/index.ejs');
		},
	},
	{
		method: 'GET',
		url: '/api/view/game',
		handler: async (_: FastifyRequest, reply: FastifyReply) => {
			const html = await reply.view('pages/game.ejs');
			return reply.type('text/html').send(html);
		},
	},
];
