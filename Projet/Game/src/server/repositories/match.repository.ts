import { DbGestion } from "../db/dbGestion.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { addMatch, isSameMatch, Match } from "../interfaces/match.js";

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

]


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


export class MatchRepository {
	constructor(private db: DbGestion) {}

	public async getMatchById(id: number) : Promise<GetMatchResult>{
		const res: Match | undefined = await this.db.getSecur(SelectSql[0], id);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}

	public async getAllMatchs() : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[1]);
		return (res);
	}

	/**
	 * 
	 * @param startDate Année-mois-jour Seulement
	 * @returns 
	 */
	public async getAllMatchsStarted(startDate : string) : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[2], startDate);
		return (res);
	}

	public async getAllMatchsEnded(endDate : string) : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[3], endDate);
		return (res);
	}

	public async getAllMatchsInProgress() : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[4]);
		return (res);
	}

	public async getAllMatchsOver() : Promise<Match []> {
		const res : Match[] = await this.db.allSecur(SelectSql[5]);
		return (res);
	}

	public async isPlayerCurrently(id: number) : Promise<boolean> {
		const res : Match[] = await this.db.getSecur(SelectSql[6], id, id);
		return (res != undefined);
	}

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

	public async updateEndMatch(controlDataMatch: Match) : Promise<UpdateMatchStatus> {
		const verifMatch : GetMatchResult = await this.getMatchById(controlDataMatch.id)
		if (verifMatch.status == "error" || false == isSameMatch(verifMatch.data, controlDataMatch))
			return ({ status: "not_found"});
		if (controlDataMatch.end_at != undefined && controlDataMatch.is_end == true)
			return ({ status: "already_ended"});
		await this.db.runSecur(UpdateSql[0], controlDataMatch.id);
		return ({ status : "success", data : null});
	}

	public async updateScores(controlDataMatch: Match, p1Score : number, p2Score : number) : Promise<UpdateMatchStatus> {
		if (p1Score == controlDataMatch.player_1_score && p2Score == controlDataMatch.player_2_score)
			return ({status:"no_change"});
		const verifMatch : GetMatchResult = await this.getMatchById(controlDataMatch.id)
		if (verifMatch.status == "error" || false == isSameMatch(verifMatch.data, controlDataMatch))
			return ({ status: "not_found"});
		if (controlDataMatch.end_at != undefined && controlDataMatch.is_end == true)
			return ({ status: "already_ended"});
		const res = await this.db.runSecur(UpdateSql[1], p1Score, p2Score, controlDataMatch.id);
		return (res == undefined ? {status:"error"} : {status:"success", data: res});
	}

	public async updateEndMatchAndScores(controlDataMatch: Match, p1Score : number, p2Score : number) : Promise<UpdateMatchStatus> {
		if (p1Score == controlDataMatch.player_1_score && p2Score == controlDataMatch.player_2_score)
			return (this.updateEndMatch(controlDataMatch));
		const verifMatch : GetMatchResult = await this.getMatchById(controlDataMatch.id)
		if (verifMatch.status == "error" || false == isSameMatch(verifMatch.data, controlDataMatch))
			return ({ status: "not_found"});
		if (controlDataMatch.end_at != undefined && controlDataMatch.is_end == true)
			return ({ status: "already_ended"});
		const res = await this.db.runSecur(UpdateSql[2], p1Score, p2Score, controlDataMatch.id);
		return (res == undefined ? {status:"error"} : {status:"success", data: res});
	}
}