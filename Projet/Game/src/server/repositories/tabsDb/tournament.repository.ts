import { DbGestion } from "../../db/dbGestion.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { addTournamentElimination, GetTournamentEliminationDataString, isSameTournamentElimination, TournamentElimination } from "../../interfaces/tabsDb/tournament.js";

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dSelect = "select/"
const SelectSql = [
	pData + dSelect +"02-0_tournament_by_id.sql",
	pData + dSelect +"02-1_all_wins_by_username.sql",
	pData + dSelect +"02-2_all_wins_by_userid.sql",
	pData + dSelect +"02-3_all_tournaments.sql",
	pData + dSelect +"02-4_all_tournaments_that_has_started_has_a_date.sql",
	pData + dSelect +"02-5_all_tournaments_that_has_ended_has_a_date.sql",
	pData + dSelect +"02-6_all_tournaments_in_progress.sql",
	pData + dSelect +"02-7_all_tournaments_over.sql",
]

const dInsert = "insert/"
const InsertSql = [
	pData + dInsert + "02-0_tournament.sql",
]

const dUpdate = "updates/"
const UpdateSql = [
	pData + dUpdate + "02-0_end_tournament.sql",
	pData + dUpdate + "02-1_insert_winer.sql",
	pData + dUpdate + "02-2_end_and_insert_winer.sql",
]

export type AddTournamentEliminationResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> }
	| { status: "invalid_param" }
	| { status: "error" };

export type UpdateTournamentEliminationResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> | null }
	| { status: "not_found" }
	| { status: "already_win" }
	| { status: "already_ended" }
	| { status: "no_match_data" }
	| { status: "error" }
	| { status: "no_change" };

export type GetTournamentEliminationResult =
	| { status: "success"; data: TournamentElimination }
	| { status: "error" };

export class TournamentEliminationRepository {
	constructor(private db: DbGestion) {}

///////// ALL SELECT

	public async getTEByid(id: number) : Promise<GetTournamentEliminationResult>{
		const res : TournamentElimination | undefined = await this.db.getSecur(SelectSql[0], id);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async getWinsTEsByUsername(username : string) : Promise<TournamentElimination[]>{
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[1], username);
		return (res);
	}

	public async getWinsTEsById(userid : number) : Promise<TournamentElimination[]>{
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[2], userid);
		return (res);
	}

	public async getAllTEs() : Promise<TournamentElimination[]>{
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[3]);
		return (res);
	}

	/**
	 * 
	 * @param startDate Année-mois-jour Seulement
	 * @returns 
	 */
	public async getAllTEsStartedDate(startDate : string) : Promise<TournamentElimination []> {
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[4], startDate);
		return (res);
	}

	/**
	 * 
	 * @param endDate Année-mois-jour Seulement
	 * @returns 
	 */
	public async getAllTEsEndDate(endDate : string) : Promise<TournamentElimination []> {
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[5], endDate);
		return (res);
	}

	public async getAllTEsInProgress() : Promise<TournamentElimination []> {
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[6]);
		return (res);
	}

	public async getAllTEsOver() : Promise<TournamentElimination []> {
		const res : TournamentElimination[] = await this.db.allSecur(SelectSql[7]);
		return (res);
	}

/////////////////////////// INSERT

	public async addTE(newTE: addTournamentElimination): Promise<AddTournamentEliminationResult> {
		if (newTE.nbr_participant <= 1)
			return ({status:"invalid_param"});
		const nbr_round: number = Math.ceil(Math.log2(newTE.nbr_participant))+1;
		const res = await this.db.runSecur(InsertSql[0], newTE.nbr_participant, nbr_round);
		return (res == undefined ? { status: "error" } : {status: "success", data: res});
	}

/////////////////////////// UPDATE

	public async updateEndTE(controlTE: TournamentElimination) : Promise<UpdateTournamentEliminationResult> {
		const verifTE : GetTournamentEliminationResult = await this.getTEByid(controlTE.id)
		if (verifTE.status == "error")
			return ({status: 'not_found'});
		else if (false == isSameTournamentElimination(verifTE.data, controlTE))
			return ({status: "no_match_data"});
		else if (controlTE.is_end != undefined && controlTE.is_end == true)
			return ({status: "already_ended"});
		const res = await this.db.runSecur(UpdateSql[0], controlTE.id);
		return (res == undefined ? {status:"error"} : {status: "success", data : res});
	}

	public async updateWiner(controlTE: TournamentElimination, newTE : TournamentElimination) : Promise<UpdateTournamentEliminationResult> {
		const {
			winner_pseudo = "",
			winner_id = "NULL",
		} = newTE;
		const verifTE : GetTournamentEliminationResult = await this.getTEByid(controlTE.id)
		if (verifTE.status == "error")
			return ({status: 'not_found'});
		else if (false == isSameTournamentElimination(verifTE.data, controlTE))
			return ({status: "no_match_data"});
		else if (controlTE.winner_pseudo != undefined && controlTE.winner_pseudo != "")
			return ({status: "already_win"});
		else if (winner_pseudo == controlTE.winner_pseudo && winner_id == controlTE.id)
			return ({status: "no_change"});
		const res = await this.db.runSecur(UpdateSql[1], winner_pseudo, winner_id, controlTE.id);
		return (res == undefined ? {status:"error"} : {status: "success", data : res});
	}

	public async updateEndAndWiner(controlTE: TournamentElimination, winner : {userId ?: number, name ?: string}) : Promise<UpdateTournamentEliminationResult> {
		const {
			name = "",
			userId = "NULL",
		} = winner;
		const verifTE : GetTournamentEliminationResult = await this.getTEByid(controlTE.id)
		if (verifTE.status == "error")
			return ({status: 'not_found'});
		else if (name == "" && userId == "NULL")
				return ({status: "error"});
		else if (false == isSameTournamentElimination(verifTE.data, controlTE))
		{
			console.log(GetTournamentEliminationDataString(verifTE.data));
			return ({status: "no_match_data"});
		}
		else if (controlTE.is_end != undefined && controlTE.is_end == true)
			return ({status: "already_ended"});
		else if (controlTE.winner_pseudo != undefined && controlTE.winner_pseudo != "")
			return ({status: "already_win"});
		const res = await this.db.runSecur(UpdateSql[2], name, userId, controlTE.id);
		return (res == undefined ? {status:"error"} : {status: "success", data : res});
	}
}