import { AddUserResult } from "../repositories/tabsDb/user.repository";
import { BaseResult, ErrorCode } from "../repositories/transandance.repository";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { AddMatchResult, UpdateMatchStatus } from "../repositories/tabsDb/match.repository";
import { AddTournamentEliminationResult } from "../repositories/tabsDb/tournament.repository";
import { AddTEPlayerResult, UpdateTEPlayerResult } from "../repositories/tabsDb/tournament_player.repository";
import { AddTEMatchResult, UpdateTEMatchResult } from "../repositories/tabsDb/tournament_match.repository";

type MappableResult = {
	status: string;
	data?: unknown;
};

/**
 * Converts AddUserResult to a generic BaseResult.
 *
 * @param result - The AddUserResult to convert.
 * @returns The equivalent BaseResult.
 */
export function mapAddUserResultToBaseResult(result: AddUserResult)
: BaseResult<any> {
	switch (result.status) {
		case "success":
		case "allSuccess":
			return { status: "success", data: result.data };
		
		case "invalid_param":
			return { status: "error", error: "invalid_param" };
		
		case "already_exists":
			return { status: "error", error: "already_exists", details : result.name };
		
		case "error":
		default:
			return { status: "error", error: "unexpected_error" as ErrorCode };
	}
}

/**
 * Converts AddMatchResult to a generic BaseResult.
 *
 * @param result - The AddMatchResult to convert.
 * @returns The equivalent BaseResult.
 */
export function mapAddMatchResultToBaseResult(result: AddMatchResult): BaseResult<any> {
	switch (result.status) {
		case "success":
			return { status: "success", data: result.data };
		case "Player 1 or/and 2 currently playing":
			return { status: "error", error: "match_in_progress" };
		case "error":
		default:
			return { status: "error", error: "unexpected_error" };
	}
}

/**
 * Converts UpdateMatchStatus to a generic BaseResult.
 *
 * @param result - The UpdateMatchStatus to convert.
 * @returns The equivalent BaseResult.
 */
export function mapUpdateMatchStatusToBaseResult(result: UpdateMatchStatus): BaseResult<any> {
	switch (result.status) {
		case "success":
			return { status: "success", data: result.data };

		case "no_change":
			return { status: "error", error: "no_change" };

		case "not_found":
			return { status: "error", error: "not_found" };

		case "already_ended":
			return { status: "error", error: "already_ended" };

		case "Player 1 or/and 2 not_found playing":
			return { status: "error", error: "user_already_playing" };

		case "error":
		default:
			return { status: "error", error: "unexpected_error" };
	}
}

/**
 * Converts UpdateTEMatchResult to a generic BaseResult.
 *
 * @param result - The UpdateTEMatchResult to convert.
 * @returns The equivalent BaseResult.
 */
export function mapUpdateTEMatchResultToBaseResult(
	result: UpdateTEMatchResult
): BaseResult<any> {
	switch (result.status) {
		case "success":
			return { status: "success", data: result.data };

		case "not_found":
			return { status: "error", error: "not_found" };

		case "already_win":
		case "already_have_match":
			return { status: "error", error: "already_exists" };

		case "invalid_param":
			return { status: "error", error: "invalid_param" };

		case "no_match_data":
			return { status: "error", error: "unexpected_error" };

		case "no_change":
			return { status: "error", error: "no_change" };

		case "error":
		default:
			return { status: "error", error: "unexpected_error" };
	}
}

/**
 * Converts AddTournamentEliminationResult to a generic BaseResult.
 *
 * @param result - The AddTournamentEliminationResult to convert.
 * @returns The equivalent BaseResult.
 */
export function mapAddTournamentEliminationResultToBaseResult(result: AddTournamentEliminationResult): BaseResult<any> {
	switch (result.status) {
		case "success":
			return { status: "success", data: result.data };

		case "invalid_param":
			return { status: "error", error: "invalid_param" };

		case "error":
		default:
			return { status: "error", error: "unexpected_error" };
	}
}

/**
 * Converts AddTEPlayerResult or AddTEMatchResult to a generic BaseResult.
 *
 * @param result - The AddTEPlayerResult or AddTEMatchResult to convert.
 * @returns The equivalent BaseResult.
 */

export function mapGenericAddResultToBaseResult(result: AddTEPlayerResult | AddTEMatchResult): BaseResult<any> {
	switch (result.status) {
		case "success":
		case "allSuccess":
			return { status: "success", data: result.data };

		case "invalid_param":
			return { status: "error", error: "invalid_param" };

		case "already_exists":
			return { status: "error", error: "already_exists" };

		case "error":
		default:
			return { status: "error", error: "unexpected_error" };
	}
}


/**
 * Converts UpdateTEPlayerResult to a generic BaseResult.
 *
 * @param result - The UpdateTEPlayerResult to convert.
 * @returns The equivalent BaseResult.
 */
export function mapUpdateTEPlayerResultToBaseResult(
	result: UpdateTEPlayerResult
): BaseResult<any> {
	switch (result.status) {
		case "success":
			return { status: "success", data: result.data };

		case "not_found":
			return { status: "error", error: "not_found" };

		case "already_win":
			return { status: "error", error: "already_exists" };

		case "already_ended":
			return { status: "error", error: "conflict" };

		case "no_match_data":
			return { status: "error", error: "unexpected_error" };

		case "invalide_param":
			return { status: "error", error: "invalid_param" };

		case "no_change":
			return { status: "error", error: "no_change" };

		case "error":
		default:
			return { status: "error", error: "unexpected_error" };
	}
}
