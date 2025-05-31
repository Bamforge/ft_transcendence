import { AddTEMatchResult, UpdateTEMatchResult } from "../repositories/tabsDb/tournament_match.repository";
import { AddTEPlayerResult } from "../repositories/tabsDb/tournament_player.repository";
import { AddUserResult } from "../repositories/tabsDb/user.repository";
import { AddResult, UpdateResult } from "../repositories/transandance.repository";

export function addUserResultToAddResult(res: AddUserResult): AddResult {
	switch(res.status) {
	case "success":
		return { status: "success", data: res.data };
	case "allSuccess":
		return { status: "allSuccess", data: res.data };
	case "invalide_param":
		return { status: "invalide_param" };
	case "already_exists":
		return { status: "already_exists", name: res.name };
	case "error":
		return { status: "error" };
	default:
		return { status: "error" };
	}
}

export function convertAddTEPlayerResultToAddResult(teResult: AddTEPlayerResult): AddResult {
	switch (teResult.status) {
		case "success":
			return { status: "success", data: teResult.data };

		case "allSuccess":
			return { status: "allSuccess", data: teResult.data };

		case "invalide_param":
			return { status: "invalide_param" };

		case "already_exists":
			return { status: "already_exists", name: [] }; // On n’a pas les noms, donc tableau vide.

		case "error":
		default:
			return { status: "error" };
	}
}

export function convertAddTEMatchResultToAddResult(input: AddTEMatchResult): AddResult {
	switch(input.status) {
		case "allSuccess":
			return { status: "allSuccess", data: input.data };
		case "success":
			return { status: "success", data: input.data };
		case "invalide_param":
			return { status: "invalide_param" };
		case "already_exists":
			return { status: "already_exists", name: [] }; // si tu as des noms, tu peux les ajouter ici
		case "error":
		default:
			return { status: "error" };
	}
}

export function convertUpdateToAddResult(updateRes: UpdateTEMatchResult): AddResult {
	switch (updateRes.status) {
		case "success":
			if (updateRes.data) {
				return { status: "success", data: updateRes.data };
			} else {
				// Si `data` est null, on considère que tout s’est bien passé mais aucun changement réel
				return { status: "no_change" }; // ou "error", à toi de voir ce qui est le plus juste
			}
		case "not_found":
			return { status: "not_found" };

		case "already_win":
		case "already_have_match":
			return { status: "Player 1 or/and 2 currently playing" };

		case "invalide_param":
			return { status: "invalide_param" };

		case "no_match_data":
			return { status: "matchIndex_not_valide" }; // ou "no_match_data" si tu veux l'ajouter à AddResult

		case "error":
			return { status: "error" };

		case "no_change":
			return { status: "no_change" };

		default:
			// Fallback pour les cas non gérés (utile si les types évoluent)
			return { status: "error" };
	}
}

export function convertUpdateTEMatchToUpdateResult(updateRes: UpdateTEMatchResult): UpdateResult {
	switch (updateRes.status) {
		case "success":
			return { status: "success", data: updateRes.data };

		case "not_found":
			return { status: "not_found" };

		case "already_win":
			return { status: "already_ended" };

		case "already_have_match":
			return { status: "Player 1 or/and 2 not_found playing" };

		case "invalide_param":
			return { status: "invalid_user" };

		case "no_match_data":
			return { status: "no_match_found" };

		case "no_change":
			return { status: "no_change" };

		case "error":
		default:
			return { status: "error" };
	}
}
