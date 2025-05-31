import { DbGestion } from "../../db/dbGestion.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { isSameTEMatch, TEMatch } from "../../interfaces/tabsDb/tournament_match.js";
import { TournamentElimination } from "../../interfaces/tabsDb/tournament.js";
import handleUpdateResult from "../../utils/handleUpdateResult.js";

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

export type AddTEMatchResult =
	| { status: "allSuccess", data: ISqlite.RunResult<sqlite3.Statement>[]}
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement>}
	| { status: "invalide_param" }
	| { status: "already_exists" }
	| { status: "error" };

export type UpdateTEMatchResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> | null }
	| { status: "not_found" }
	| { status: "already_win" }
	| { status: "already_have_match" }
	| { status: "invalide_param"}
	| { status: "no_match_data" }
	| { status: "error" }
	| { status: "no_change" };

export type GetTEMatchResult =
	| { status: "success"; data: TEMatch }
	| { status: "error" };

export class TEMatchRepository {
	constructor(private db: DbGestion) {}


	/////////////////////////// INSERT

	private async addTEMatch(idTE : number, order: number): Promise<AddTEMatchResult> {
		if (idTE <= 0 || order <= order)
			return ({status:"invalide_param"});
		const res = await this.db.runSecur(InsertSql[0], idTE, order);
		return (res == undefined ? { status: "error" } : {status: "success", data: res});
	}

	public async addTEMatchsFromTE(te : TournamentElimination): Promise<AddTEMatchResult> {
		if (te.id <= 0 || te.nbr_participant <= 1)
			return { status: "invalide_param"};
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

	public async getTEMatchByTEidAndOrder(idTE: number, order: number) : Promise<GetTEMatchResult>{
		const res : TEMatch | undefined = await this.db.getSecur(SelectSql[0], idTE, order);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async getTEMatchByTEidAndMatchid(idTE: number, idMatch: number) : Promise<GetTEMatchResult>{
		const res : TEMatch | undefined = await this.db.getSecur(SelectSql[1], idTE, idMatch);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async getWinneridByTEidAndOrder(idTE: number, order: number) : Promise<GetTEMatchResult>{
		const res : TEMatch | undefined = await this.db.getSecur(SelectSql[2], idTE, order);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async getAllTEMatchByTEid(idTE: number) : Promise<TEMatch[]>{
		const res : TEMatch[] | undefined = await this.db.allSecur(SelectSql[3], idTE);
		return (res );
	}

	public async isTEMatchAlreadyExistByTEidAndUserid(tournament_elimination_id: number, user_id: number) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[4], tournament_elimination_id, user_id);
		return (res != undefined);
	}

	public async isTEMatchAlreadyExistByTEi(tournament_elimination_id: number) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[5], tournament_elimination_id);
		return (res != undefined);
	}

	/////////////////////////// UPDATE

	public async updateMatchid(controlTE: TEMatch, matchId: number): Promise<UpdateTEMatchResult> {
		const verifTEP : GetTEMatchResult = await this.getTEMatchByTEidAndOrder(controlTE.tournament_elimination_id, controlTE.order_match);
		if (matchId <= 0)
			return ({status: "invalide_param"});
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

	public async markWinner(controlTE: TEMatch, winnerId: number ): Promise<UpdateTEMatchResult> {
		const verifTEP : GetTEMatchResult = await this.getTEMatchByTEidAndOrder(controlTE.tournament_elimination_id, controlTE.order_match);
		if (winnerId <= 0)
			return ({status: "invalide_param"});
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