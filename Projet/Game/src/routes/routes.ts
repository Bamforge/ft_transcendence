import { FastifyRequest, FastifyReply } from 'fastify';
import { route_hello } from "./route_hello";
import { route_home } from "./route_home";
import { route_visit, route_visits } from './route_visits';
import { route_racine } from './route_racine';
import { route_about } from './route_about';
import { route_404 } from './route_404';

// Interface for user in request
declare module 'fastify' {
	interface FastifyRequest {
		user?: { id: number; username: string; password: string };
	}
}

/**
 * Tableaux de route qui sont coposé d'une requete d'une url et d'une fonction atitré
*/
export const routes = [
	route_hello,
	route_home,
	route_visit,
	route_visits,
	route_racine,
	route_404,
	route_about
];
