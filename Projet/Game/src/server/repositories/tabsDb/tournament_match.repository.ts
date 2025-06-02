import { DbGestion } from "../../db/dbGestion.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { isSameTEMatch, TEMatch } from "../../interfaces/tabsDb/tournament_match.js";
import { TournamentElimination } from "../../interfaces/tabsDb/tournament.js";
import handleUpdateResult from "../../utils/handleUpdateResult.js";

//////////////////////////////////////////////
//            Script SQL path               //
//////////////////////////////////////////////

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dInsert = "insert/"
const InsertSql = [
	pData + dInsert + "04-0_tournament_match.sql",
]

const dSelect = "select/"
const SelectSql = [
	pData + dSelect +"04-0_TEMatch_by_TEid_AND_order.sql",
	pData + dSelect +"04-1_TEMatch_by_TEid_AND_Matchid.sql",
	pData + dSelect +"04-2_winerid_by_round_AND_TEid.sql",
	pData + dSelect +"04-3_all_TEMatchs_by_TEid.sql",
	pData + dSelect +"04-4_exist_TEMatchs_by_TEid_AND_order.sql",
	pData + dSelect +"04-5_exist_TEMatchs_by_TEid.sql",
]

const dUpdate = "updates/"
const UpdateSql = [
	pData + dUpdate + "04-0_matchid.sql",
	pData + dUpdate + "04-1_winer.sql",
]

//////////////////////////////////////////////
//          TYPE RETURN METHOD              //
//////////////////////////////////////////////

export type AddTEMatchResult =
	| { status: "allSuccess", data: ISqlite.RunResult<sqlite3.Statement>[]}
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement>}
	| { status: "invalid_param" }
	| { status: "already_exists" }
	| { status: "error" };

export type UpdateTEMatchResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> | null }
	| { status: "not_found" }
	| { status: "already_win" }
	| { status: "already_have_match" }
	| { status: "invalid_param"}
	| { status: "no_match_data" }
	| { status: "error" }
	| { status: "no_change" };

export type GetTEMatchResult =
	| { status: "success"; data: TEMatch }
	| { status: "error" };


//////////////////////////////////////////////
//                  CLASS                   //
//////////////////////////////////////////////

/**
 * The class that manages the "tournament_elimination_matchs" array of the database
 */
export class TEMatchRepository {
	constructor(private db: DbGestion) {}


	/////////////////////////// INSERT

	/**
	 * Adds a match to the elimination tournament with the specified order.
	 * @param idTE - ID of the tournament elimination.
	 * @param order - Order/index of the match in the bracket.
	 * @returns Result of the insertion operation.
	 */
	private async addTEMatch(idTE : number, order: number): Promise<AddTEMatchResult> {
		if (idTE <= 0 || order <= order)
			return ({status:"invalid_param"});
		const res = await this.db.runSecur(InsertSql[0], idTE, order);
		return (res == undefined ? { status: "error" } : {status: "success", data: res});
	}

	/**
	 * Adds all matches required for a tournament elimination tree based on the number of participants.
	 * @param te - The tournament elimination object.
	 * @returns Result of the bulk insertion operation.
	 */
	public async addTEMatchsFromTE(te : TournamentElimination): Promise<AddTEMatchResult> {
		if (te.id <= 0 || te.nbr_participant <= 1)
			return { status: "invalid_param"};
		else if (await this.isTEMatchAlreadyExistByTEi(te.id))
			return { status: "already_exists"};
		// Filtrer les utilisateurs qui n'existent pas déjà
		const tableau = Array.from({ length: te.nbr_participant - 1 }, (_, i) => [te.id, i + 1]);

		const res = await this.db.prepareSecur(InsertSql[0], tableau, "Run");

		if (res === undefined)
			return { status: "error" };

		return { status: "allSuccess", data: res };
	}

	/////////////////////////// SELECT

	/**
	 * Retrieves a specific match of a tournament by its order/index in the tree.
	 * @param idTE - ID of the tournament elimination.
	 * @param order - Order of the match.
	 * @returns The match if found, or an error.
	 */
	public async getTEMatchByTEidAndOrder(idTE: number, order: number) : Promise<GetTEMatchResult>{
		const res : TEMatch | undefined = await this.db.getSecur(SelectSql[0], idTE, order);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	/**
	 * Retrieves a match by tournament ID and match ID.
	 * @param idTE - ID of the tournament elimination.
	 * @param idMatch - ID of the match.
	 * @returns The match if found, or an error.
	 */
	public async getTEMatchByTEidAndMatchid(idTE: number, idMatch: number) : Promise<GetTEMatchResult>{
		const res : TEMatch | undefined = await this.db.getSecur(SelectSql[1], idTE, idMatch);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	/**
	 * Gets the winner ID for a specific match order in a tournament.
	 * @param idTE - ID of the tournament elimination.
	 * @param order - Order of the match.
	 * @returns The match result with the winner ID, if any.
	 */
	public async getWinneridByTEidAndOrder(idTE: number, order: number) : Promise<GetTEMatchResult>{
		const res : TEMatch | undefined = await this.db.getSecur(SelectSql[2], idTE, order);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	/**
	 * Retrieves all matches for a given tournament elimination.
	 * @param idTE - ID of the tournament elimination.
	 * @returns An array of matches.
	 */
	public async getAllTEMatchByTEid(idTE: number) : Promise<TEMatch[]>{
		const res : TEMatch[] | undefined = await this.db.allSecur(SelectSql[3], idTE);
		return (res );
	}

	/**
	 * Checks if a user is already associated with a match in a given tournament.
	 * @param tournament_elimination_id - ID of the tournament elimination.
	 * @param user_id - User ID to check.
	 * @returns True if a match exists, false otherwise.
	 */
	public async isTEMatchAlreadyExistByTEidAndUserid(tournament_elimination_id: number, user_id: number) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[4], tournament_elimination_id, user_id);
		return (res != undefined);
	}

	/**
	 * Checks if matches already exist for a tournament elimination.
	 * @param tournament_elimination_id - ID of the tournament elimination.
	 * @returns True if matches exist, false otherwise.
	 */
	public async isTEMatchAlreadyExistByTEi(tournament_elimination_id: number) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[5], tournament_elimination_id);
		return (res != undefined);
	}

	/////////////////////////// UPDATE

	/**
	 * Updates the match ID of a given tournament match.
	 * @param controlTE - Match object for validation and identification.
	 * @param matchId - New match ID to assign.
	 * @returns Result of the update operation.
	 */
	public async updateMatchid(controlTE: TEMatch, matchId: number): Promise<UpdateTEMatchResult> {
		const verifTEP : GetTEMatchResult = await this.getTEMatchByTEidAndOrder(controlTE.tournament_elimination_id, controlTE.order_match);
		if (matchId <= 0)
			return ({status: "invalid_param"});
		else if (verifTEP.status == "error")
			return ({status: 'not_found'});
		else if (false == isSameTEMatch(verifTEP.data, controlTE))
			return ({status: "no_match_data"});
		else if (controlTE.winner_id != undefined)
			return ({status: "already_win"});
		else if (controlTE.match_id != undefined)
			return ({status: "already_have_match"});
		const res = await this.db.runSecur(UpdateSql[0], matchId, controlTE.tournament_elimination_id, controlTE.order_match);
		return handleUpdateResult(res, { status: "no_change" });
	}

	/**
	 * Marks a match as won by the specified user.
	 * @param controlTE - Match object for validation and identification.
	 * @param winnerId - ID of the winning user.
	 * @returns Result of the update operation.
	 */
	public async markWinner(controlTE: TEMatch, winnerId: number ): Promise<UpdateTEMatchResult> {
		const verifTEP : GetTEMatchResult = await this.getTEMatchByTEidAndOrder(controlTE.tournament_elimination_id, controlTE.order_match);
		if (winnerId <= 0)
			return ({status: "invalid_param"});
		else if (verifTEP.status == "error")
			return ({status: 'not_found'});
		else if (false == isSameTEMatch(verifTEP.data, controlTE))
			return ({status: "no_match_data"});
		else if (controlTE.winner_id != undefined)
			return ({status: "already_win"});
		const res = await this.db.runSecur(UpdateSql[1], winnerId, controlTE.tournament_elimination_id, controlTE.order_match);
		return handleUpdateResult(res, { status: "no_change" });
	}
}