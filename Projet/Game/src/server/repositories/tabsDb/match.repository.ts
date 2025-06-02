import { DbGestion } from "../../db/dbGestion.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { addMatch, isSameMatch, Match } from "../../interfaces/tabsDb/match.js";

//////////////////////////////////////////////
//            Script SQL path               //
//////////////////////////////////////////////

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dSelect = "select/"
const SelectSql = [
	pData + dSelect + "01-0_match_by_id.sql",
	pData + dSelect + "01-1_all_matchs.sql",
	pData + dSelect + "01-2_all_matchs_that_has_started_has_a_date.sql",
	pData + dSelect + "01-3_all_matchs_that_has_ended_has_a_date.sql",
	pData + dSelect + "01-4_all_matchs_in_progress.sql",
	pData + dSelect + "01-5_all_matchs_over.sql",
	pData + dSelect + "01-6_player_currently_playing.sql",
	pData + dSelect + "01-7_who_win.sql",
]

//////////////////////////////////////////////

const dInsert = "insert/"
const InsertSql = [
	pData + dInsert + "01-0_match.sql",
]

const dUpdate = "updates/"
const UpdateSql = [
	pData + dUpdate + "01-0_end_match.sql",
	pData + dUpdate + "01-1_score.sql",
	pData + dUpdate + "01-2_end_match_and_score.sql",
]

//////////////////////////////////////////////
//          TYPE RETURN METHOD              //
//////////////////////////////////////////////

export type AddMatchResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> }
	| { status: "Player 1 or/and 2 currently playing" }
	| { status: "error" };

export type GetMatchResult =
	| { status: "success"; data: Match }
	| { status: "error" };

export type UpdateMatchStatus =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> | null }
	| { status: "no_change" }
	| { status: "not_found" }
	| { status: "Player 1 or/and 2 not_found playing" }
	| { status: "already_ended" }
	| { status: "error" };

//////////////////////////////////////////////
//                  CLASS                   //
//////////////////////////////////////////////

/**
 * The class that manages the "matches" array of the database
 */
export class MatchRepository {
	constructor(private db: DbGestion) {}

	/**
	 * Get a match by its unique ID.
	 *
	 * @param id - Match ID to search for.
	 * @returns A GetMatchResult: either success with data or error.
	 */
	public async getMatchById(id: number) : Promise<GetMatchResult>{
		const res: Match | undefined = await this.db.getSecur(SelectSql[0], id);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

/**
 * Get all matches in the database.
 *
 * @returns An array of Match objects.
 */
	public async getAllMatchs() : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[1]);
		return (res);
	}

/**
 * Get all matches that started on a specific date.
 *
 * @param startDate - Date in format YYYY-MM-DD.
 * @returns Array of matches that started on that date.
 */
	public async getAllMatchsStarted(startDate : string) : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[2], startDate);
		return (res);
	}

/**
 * Get all matches that ended on a specific date.
 *
 * @param endDate - Date in format YYYY-MM-DD.
 * @returns Array of matches that ended on that date.
 */
	public async getAllMatchsEnded(endDate : string) : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[3], endDate);
		return (res);
	}

/**
 * Get all matches currently in progress (not finished yet).
 *
 * @returns Array of ongoing Match objects.
 */
	public async getAllMatchsInProgress() : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[4]);
		return (res);
	}

/**
 * Get all finished matches.
 *
 * @returns Array of completed Match objects.
 */
	public async getAllMatchsOver() : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[5]);
		return (res);
	}

/**
 * Check if a specific player is currently in a match.
 *
 * @param id - Player ID to check.
 * @returns True if player is in an ongoing match, otherwise false.
 */
	public async isPlayerCurrently(id: number) : Promise<boolean> {
		const res : Match | undefined = await this.db.getSecur(SelectSql[6], id, id);
		return (res != undefined);
	}

/**
 * Check which players from a list are currently in a match.
 *
 * @param ids - Array of player IDs.
 * @returns Array of player IDs that are currently in a match, or undefined on error.
 */
	public async isPlayersCurrently(ids: number[]) : Promise<number[] | undefined> {
		const allPersonneWhoPlayMaybe : Match[] | undefined = await this.db.prepareSecur(
			SelectSql[6],
			ids.map(id => [id, id]),
			"Get");

		if (allPersonneWhoPlayMaybe == undefined) return undefined;

		const idAllPersonneWhoPlay : number[] = [];
		for (const PersonneWhoPlayMaybe of allPersonneWhoPlayMaybe) {
			if (PersonneWhoPlayMaybe != undefined)
				idAllPersonneWhoPlay.push(PersonneWhoPlayMaybe.id);
		}
		return (idAllPersonneWhoPlay);
	}

/**
 * Get the winner ID of a match.
 *
 * @param id - Match ID to get the winner from.
 * @returns The winner's user ID, or undefined if not found or no winner yet.
 */
	public async getWinner(id: number) : Promise<number | undefined>{
		const res = await this.db.getSecur(SelectSql[7], id);
		if (res == undefined)
			return (res)
		return (res.winner_id);
	}

/**
 * Add a new match between two players.
 *
 * @param newMatch - Object containing player_1_id and player_2_id.
 * @returns AddMatchResult: success with inserted data or error/status.
 */
	public async addMatch(newMatch: addMatch): Promise<AddMatchResult> {
		const {
			player_1_id,
			player_2_id
		} = newMatch;

		if (await this.isPlayerCurrently(player_1_id) || await this.isPlayerCurrently(player_2_id))
			return ({status:"Player 1 or/and 2 currently playing"});

		const res = await this.db.runSecur(InsertSql[0], player_1_id, player_2_id);
		return (res == undefined ? {status:"error"} : {status:"success", data: res});
	}

/**
 * Mark a match as ended (set end timestamp and is_end = true).
 *
 * @param controlDataMatch - Match data to verify and update.
 * @returns UpdateMatchStatus indicating result.
 */
	public async updateEndMatch(controlDataMatch: Match) : Promise<UpdateMatchStatus> {
		const verifMatch : GetMatchResult = await this.getMatchById(controlDataMatch.id)

		if (verifMatch.status == "error" || false == isSameMatch(verifMatch.data, controlDataMatch))
			return ({ status: "not_found"});
		else if (controlDataMatch.end_at != undefined && controlDataMatch.is_end == true)
			return ({ status: "already_ended"});

		await this.db.runSecur(UpdateSql[0], controlDataMatch.id);
		return ({ status : "success", data : null});
	}

/**
 * Update the scores of a match.
 *
 * @param controlDataMatch - Match object to verify.
 * @param p1Score - New score for player 1.
 * @param p2Score - New score for player 2.
 * @returns UpdateMatchStatus indicating result.
 */
	public async updateScores(controlDataMatch: Match, p1Score : number, p2Score : number) : Promise<UpdateMatchStatus> {
		if (p1Score == controlDataMatch.player_1_score && p2Score == controlDataMatch.player_2_score)
			return ({status:"no_change"});

		const verifMatch : GetMatchResult = await this.getMatchById(controlDataMatch.id)

		if (verifMatch.status == "error" || false == isSameMatch(verifMatch.data, controlDataMatch))
			return ({ status: "not_found"});
		else if (controlDataMatch.end_at != undefined && controlDataMatch.is_end == true)
			return ({ status: "already_ended"});

		const res = await this.db.runSecur(UpdateSql[1], p1Score, p2Score, controlDataMatch.id);
		return (res == undefined ? {status:"error"} : {status:"success", data: res});
	}

/**
 * Update both scores and mark the match as ended.
 *
 * @param controlDataMatch - Match to verify and update.
 * @param p1Score - Final score for player 1.
 * @param p2Score - Final score for player 2.
 * @returns UpdateMatchStatus indicating result.
 */
	public async updateEndMatchAndScores(controlDataMatch: Match, p1Score : number, p2Score : number) : Promise<UpdateMatchStatus> {
		if (p1Score == controlDataMatch.player_1_score && p2Score == controlDataMatch.player_2_score)
			return (this.updateEndMatch(controlDataMatch));

		const verifMatch : GetMatchResult = await this.getMatchById(controlDataMatch.id)

		if (verifMatch.status == "error" || false == isSameMatch(verifMatch.data, controlDataMatch))
			return ({ status: "not_found"});
		else if (controlDataMatch.end_at != undefined && controlDataMatch.is_end == true)
			return ({ status: "already_ended"});

		const res = await this.db.runSecur(UpdateSql[2], p1Score, p2Score, controlDataMatch.id);
		return (res == undefined ? {status:"error"} : {status:"success", data: res});
	}
}