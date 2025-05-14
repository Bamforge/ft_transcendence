import { FastifyRequest, FastifyReply } from 'fastify';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

export const route_test_ejs = 
{
		method: 'GET',
		url: '/test_ejs',
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return reply.view("test", { name: "YAYA" });
		},
}
