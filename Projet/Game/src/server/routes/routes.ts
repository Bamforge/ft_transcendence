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
	{
		method: 'GET',
		url: '/api/view/about',
		handler: async (_: FastifyRequest, reply: FastifyReply) => {
			const html = await reply.view('pages/about.ejs');
			return reply.type('text/html').send(html);
		},
	},
	{
		method: 'GET',
		url: '/api/view/standings',
		handler: async (_: FastifyRequest, reply: FastifyReply) => {
			const html = await reply.view('pages/standings.ejs');
			return reply.type('text/html').send(html);
		},
	},
	{
		method: 'GET',
		url: '/api/view/tournaments',
		handler: async (_: FastifyRequest, reply: FastifyReply) => {
			const html = await reply.view('pages/tournaments.ejs');
			return reply.type('text/html').send(html);
		},
	},
	// 404 fallback route (should be last)
	{
		method: 'GET',
		url: '/*',
		handler: async (_: FastifyRequest, reply: FastifyReply) => {
			reply.code(404);
			return reply.view('layouts/index.ejs', { notFound: true });
		},
	},
];
