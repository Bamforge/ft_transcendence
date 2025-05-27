import { DbGestion } from "../db/dbGestion.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { addTEPlayer, isSameTEPlayer, TEPlayer } from "../interfaces/tournament_player.js";

const pData = "./../../../data/sql/"

// Variables I recommend storing in environment variables for later use.

const dInsert = "insert/"
const InsertSql = [
	pData + dInsert + "03-0_tournament_player.sql",
]

const dSelect = "select/"
const SelectSql = [
	pData + dSelect +"03-0_TEPlayer_by_TEid_AND_userid.sql",
	pData + dSelect +"03-1_TEPlayer_by_TE_id_AND_id_in_TE.sql",
	pData + dSelect +"03-2_all_TEPlayers_eliminated.sql",
	pData + dSelect +"03-3_all_TEPlayers_by_TEid.sql",
]


const dUpdate = "updates/"
const UpdateSql = [
	pData + dUpdate + "03-0_round.sql",
	pData + dUpdate + "03-1_eliminated.sql",
	pData + dUpdate + "03-2_winer.sql",
]

export type AddTEPlayerResult =
	| { status: "allSuccess", data: ISqlite.RunResult<sqlite3.Statement>[]}
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement>}
	| { status: "invalide_param" }
	| { status: "already_exists" }
	| { status: "error" };

export type UpdateTournamentEliminationResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> | null }
	| { status: "not_found" }
	| { status: "already_win" }
	| { status: "already_ended" }
	| { status: "no_match_data" }
	| { status: "error" }
	| { status: "invalide_param" }
	| { status: "no_change" };

export type GetTournamentEliminationResult =
	| { status: "success"; data: TEPlayer }
	| { status: "error" };

export class TEPlayerRepository {
	constructor(private db: DbGestion) {}

	public async isTEPlayerAlreadyExist(tournament_elimination_id: number, user_id: number) : Promise<boolean>{
		const res = await this.db.getSecur(SelectSql[0], tournament_elimination_id, user_id);
		return (res != undefined);
	}

/////////////////////////// INSERT

	public async addTEPlayer(newTEPlayer: addTEPlayer, id_in_tournament_elimination: number): Promise<AddTEPlayerResult> {
		const {
			tournament_elimination_id,
			user_id,
			round,
		} = newTEPlayer;
		if (await this.isTEPlayerAlreadyExist(tournament_elimination_id, user_id))
			return ({status : "already_exists"});
		else if (round <= 0)
			return ({status : "invalide_param"});
		const res = await this.db.runSecur(InsertSql[0], tournament_elimination_id, user_id, id_in_tournament_elimination, round);
		return (res == undefined ? { status: "error" } : {status: "success", data: res});
	}

	public async addTEPlayers(newTEPlayers: addTEPlayer[]): Promise<AddTEPlayerResult> {

		if (!newTEPlayers || newTEPlayers.length === 0)
			return { status: "invalide_param" };
	
		if (newTEPlayers.some(player => player.round <= 0))
			return { status: "invalide_param" };

		for (const player of newTEPlayers) {
			if (await this.isTEPlayerAlreadyExist(player.tournament_elimination_id, player.user_id)) {
				return { status: "already_exists" };
			}
		}

		const paramList: any[][] = newTEPlayers.map((player, index) => [
			player.tournament_elimination_id,
			player.user_id,
			index + 1,
			player.round
		]);

		const res = await this.db.prepareSecur(InsertSql[0], paramList);

		if (res === undefined)
			return { status: "error" };
		return { status: "allSuccess", data: res };
	}

	// Ne peut etre modifier en suite tout dun coup
	public async addTEPlayersFromIDUser(idTE : number, idUsers : number[]): Promise<AddTEPlayerResult> {
		if (!idUsers || idUsers.length <= 1)
			return { status: "invalide_param" };

		// Filtrer les utilisateurs qui n'existent pas déjà
		const filteredUsers: number[] = [];
		for (const idUser of idUsers) {
			if (!(await this.isTEPlayerAlreadyExist(idTE, idUser))) {
				filteredUsers.push(idUser);
			}
		}

		// Si tous les utilisateurs existent déjà
		if (filteredUsers.length === 0)
			return { status: "invalide_param" };

		// Construction des paramètres pour l'insertion
		const paramList: any[][] = filteredUsers.map((idUser, index) => {
			const row = [
				idTE,
				idUser,
				index + 1,
				Math.ceil(Math.log2(idUsers.length))
			];
			console.log("Paramètre généré :", row);
			return row;
		});

		const res = await this.db.prepareSecur(InsertSql[0], paramList);

		if (res === undefined)
			return { status: "error" };

		return { status: "allSuccess", data: res };
	}
/////////////////////////// INSERT


	public async getTEPlayerByTEidAndUserid(TEid: number, Userid: number) : Promise<GetTournamentEliminationResult>{
		const res : TEPlayer | undefined = await this.db.getSecur(SelectSql[0], TEid, Userid);
		return (res == undefined ? {status : "error"} : {status : "success", data : res});
	}
	public async getTEPlayerByTEidAndIdInTE(TEid: number, idInTE: number): Promise<GetTournamentEliminationResult> {
		const res: TEPlayer | undefined = await this.db.getSecur(SelectSql[1], TEid, idInTE);
		return res === undefined ? { status: "error" } : { status: "success", data: res };
	}

	public async getAllTEPlayersEliminatedByTEidAndUserid(TEid: number, userId: number): Promise<TEPlayer[]> {
		const res: TEPlayer[] = await this.db.allSecur(SelectSql[2], TEid, userId);
		return res;
	}

	public async getAllTEPlayersByTEid(TEid: number): Promise<TEPlayer[]> {
		const res: TEPlayer[] = await this.db.allSecur(SelectSql[3], TEid);
		return res;
	}

	/////////////////////////// UPDATE

	private handleUpdateResult(res: ISqlite.RunResult<sqlite3.Statement> | undefined, onZeroChange: UpdateTournamentEliminationResult)
	: UpdateTournamentEliminationResult {
		if (res === undefined) return { status: "error" };
		if (res.changes === 0) return onZeroChange;
		return { status: "success", data: res };
	}

	public async updateRound(TEPlayerController: TEPlayer, newRound: number): Promise<UpdateTournamentEliminationResult> {
		const verifTEP : GetTournamentEliminationResult = await this.getTEPlayerByTEidAndUserid(TEPlayerController.tournament_elimination_id, TEPlayerController.user_id);
		if (verifTEP.status == "error")
			return ({status: 'not_found'});
		else if (false == isSameTEPlayer(verifTEP.data, TEPlayerController))
			return ({status: "no_match_data"});
		else if (newRound <= 0)
			return ({status: "invalide_param"});
		const res = await this.db.runSecur(UpdateSql[0], newRound, TEPlayerController.tournament_elimination_id, TEPlayerController.user_id);
		return this.handleUpdateResult(res, { status: "no_change" });
	}

	public async markEliminated(TEPlayerController: TEPlayer): Promise<UpdateTournamentEliminationResult> {
		const verifTEP = await this.getTEPlayerByTEidAndUserid(
			TEPlayerController.tournament_elimination_id, TEPlayerController.user_id);
		if (verifTEP.status === "error") return { status: "not_found" };
		if (!isSameTEPlayer(verifTEP.data, TEPlayerController)) return { status: "no_match_data" };

		const res = await this.db.runSecur(
			UpdateSql[1],
			TEPlayerController.tournament_elimination_id,
			TEPlayerController.user_id
		);
		return this.handleUpdateResult(res, { status: "no_change" });
	}

	public async markWinner(TEPlayerController: TEPlayer): Promise<UpdateTournamentEliminationResult> {
		const verifTEP = await this.getTEPlayerByTEidAndUserid(
			TEPlayerController.tournament_elimination_id,
			TEPlayerController.user_id
		);
		if (verifTEP.status === "error") return { status: "not_found" };
		if (!isSameTEPlayer(verifTEP.data, TEPlayerController)) return { status: "no_match_data" };

		const res = await this.db.runSecur(
			UpdateSql[2],
			TEPlayerController.tournament_elimination_id,
			TEPlayerController.user_id
		);
		return this.handleUpdateResult(res, { status: "already_win" });
	}
}