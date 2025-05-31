import { TournamentElimination } from "../interfaces/tabsDb/tournament";
import { addUser, User } from "../interfaces/tabsDb/users";

export function isUser(obj: any): obj is User {
	return typeof obj === 'object' && 'id' in obj && 'username' in obj;
}

export function isAddUser(obj: any): obj is addUser {
	return typeof obj === 'object' && 'username' in obj && !('id' in obj);
}

export function isTE(obj: any): obj is TournamentElimination {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof obj.id === 'number' &&
		(typeof obj.winner_pseudo === 'string' || typeof obj.winner_pseudo === 'undefined') &&
		typeof obj.winner_id === 'number' &&
		typeof obj.nbr_participant === 'number' &&
		typeof obj.max_round === 'number' &&
		typeof obj.start_at === 'string' &&
		typeof obj.is_end === 'boolean' &&
		(typeof obj.end_at === 'string' || typeof obj.end_at === 'undefined')
	);
}
