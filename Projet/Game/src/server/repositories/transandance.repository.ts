import { DbGestion } from "../db/dbGestion.js";
import { addUser, User } from "../interfaces/tabsDb/users.js";
import { AddMatchResult, GetMatchResult, MatchRepository, UpdateMatchStatus } from "./tabsDb/match.repository.js";
import { GetTournamentEliminationResult, TournamentEliminationRepository } from "./tabsDb/tournament.repository.js";
import { AddTEMatchResult, GetTEMatchResult, TEMatchRepository, UpdateTEMatchResult } from "./tabsDb/tournament_match.repository.js";
import { AddTEPlayerResult, GetTEPlayerResult, TEPlayerRepository } from "./tabsDb/tournament_player.repository.js";
import { UserRepository } from "./tabsDb/user.repository.js";
import sqlite3 from 'sqlite3';
import { ISqlite } from 'sqlite';
import { Match } from "../interfaces/tabsDb/match.js";
import { isAddUser, isUser } from "../utils/isType.js";
import { addUserResultToAddResult, convertAddTEMatchResultToAddResult, convertAddTEPlayerResultToAddResult, convertUpdateTEMatchToUpdateResult, convertUpdateToAddResult } from "../utils/convertisseur.js";
import { addTEPlayer, TEPlayer } from "../interfaces/tabsDb/tournament_player.js";
import { getMaxRounds } from "../utils/math.js";
import { TournamentElimination } from "../interfaces/tabsDb/tournament.js";

export type AddResult =
	| { status: "success", data: ISqlite.RunResult<sqlite3.Statement> }
	| { status: "Player 1 id Don't found in User tab"}
	| { status: "Player 2 id Don't found in User tab"}
	| { status: "Player 1 or/and 2 currently playing"}
	| { status: "already_exists", name: string[];}
	| { status: "allSuccess", data: ISqlite.RunResult<sqlite3.Statement>[]}
	| { status: "invalide_param"}
	| { status: "User_play", listId: number[]}
	| { status: "error" }
	| { status: "invalid_user" }
	| { status: "no_winner_yet" }
	| { status: "matchIndex_not_valide" }
	| { status: "no_change"}
	| { status: "not_found" };

	export type UpdateResult =
	| { status: "success"; data: ISqlite.RunResult<sqlite3.Statement> | null }
	| { status: "invalid_user" }
	| { status: "no_winner_yet" }
	| { status: "matchIndex_not_valide" }
	| { status: "username_exists" }
	| { status: "not_found" }
	| { status: "Player 1 or/and 2 not_found playing" }
	| { status: "error" }
	| {status: "no_change"}
	| {status: "no_match_found"}
	| {status: "already_ended"};

export type GetResult =
	| { status: "success"; data: any }
	| { status: "error" };

export class TransandanceRepository
{
	private _userTab: UserRepository;
	private _matchTab: MatchRepository;
	private _teTab: TournamentEliminationRepository;
	private _tePlayerTab: TEPlayerRepository;
	private _teMatchTab : TEMatchRepository;

	constructor(private db: DbGestion) {
		this._userTab = new UserRepository(db);
		this._matchTab = new MatchRepository(db);
		this._teTab = new TournamentEliminationRepository(db);
		this._tePlayerTab = new TEPlayerRepository(db);
		this._teMatchTab = new TEMatchRepository(db);
	}

	// ajoute un utilisateur
	public async addUser(newUser: addUser): Promise<AddResult>
	{
		return (addUserResultToAddResult(await this._userTab.addUser(newUser)));
	}

	// Crée un match
	public async addAndStartMatch(idJ1 : number, idJ2: number): Promise<AddResult>
	{
		// Avant vierif que l'id de ces joueur existe
		if (await this._userTab.isIdAlreadyExist(idJ1) == false)
			return ({status: "Player 1 id Don't found in User tab"});
		else if (await this._userTab.isIdAlreadyExist(idJ2) == false)
			return ({status: "Player 2 id Don't found in User tab"});
		const resAddUser : AddMatchResult = await this._matchTab.addMatch({player_1_id: idJ1, player_2_id: idJ2});
		const res : AddResult = (resAddUser.status == "success" ? {status : resAddUser.status, data : resAddUser.data} : {status : resAddUser.status});
		return (res);
	}

	public async endMatch(match : number | Match, idJ1 : number, idJ2: number, scoreJ1 : number, scoreJ2 : number): Promise<UpdateResult>
	{
		const matchData: GetMatchResult = typeof match === 'number'
			? await this._matchTab.getMatchById(match)
			: await this._matchTab.getMatchById(match.id);

		if (matchData.status === "error")
			return { status: "not_found" };

		const actualMatch = matchData.data;

		if (actualMatch.player_1_id !== idJ1 || actualMatch.player_2_id !== idJ2)
			return { status: "Player 1 or/and 2 not_found playing" };

		const result: UpdateMatchStatus = await this._matchTab.updateEndMatchAndScores(actualMatch, scoreJ1, scoreJ2);

		return result.status === "success"
			? { status: result.status, data: result.data }
			: { status: result.status };
	}

	public async creationTournamentElimination(allPlayer: number[] | User[] | addUser[]): Promise<AddResult>
	{
		if (allPlayer.length <= 1)
			return {status:"error"};

		if (allPlayer.every(p => typeof p === "number") || allPlayer.every(p => isUser(p)))
		{
			let ids: number[] | undefined;

			if (allPlayer.every(p => typeof p === "number"))
				ids = allPlayer as number[];
			else if (allPlayer.every(p => isUser(p)))
				ids = (allPlayer as User[]).map(p => p.id);
			else
				return { status: "invalide_param" };

			const someoneDontExist = await this._userTab.isIdAlreadyExists(ids);
			if (someoneDontExist == undefined || someoneDontExist == false)
				return ({status:"invalide_param"});

			const listeOfPerssoneAlreadyPlaying = await this._matchTab.isPlayersCurrently(ids)
			if (listeOfPerssoneAlreadyPlaying == undefined)
				return ({status:"error"});
			else if (listeOfPerssoneAlreadyPlaying.length != 0)
				return ({status : "User_play", listId: listeOfPerssoneAlreadyPlaying})
		}
		else if (isAddUser(allPlayer[0]))
		{
			// si addUser alors il faut crée les user Attention verifier que les username son unique sinon renvoye tout les pseudo deja pris
			const resAddUsers = await this._userTab.addUsers(allPlayer);
			if (resAddUsers.status != "allSuccess") return addUserResultToAddResult(resAddUsers);
		}

		let listIdUser;
		// si add user je recupere l'id des utilisateur en fonction de leur username
		if (allPlayer.every(p => typeof p === "number"))
			listIdUser = allPlayer as number[];
		else if (allPlayer.every(p => isUser(p)))
			listIdUser = (allPlayer as User[]).map(p => p.id);
		else if (allPlayer.every(p => isAddUser(p)))
			listIdUser = await this._userTab.getAllIdUsers();
		else
			return { status: "invalide_param" };

		const resCreatTE = await this._teTab.addTE({nbr_participant: listIdUser.length});
		if (resCreatTE.status != "success" ) return addUserResultToAddResult(resCreatTE);
		else if (resCreatTE.data.lastID == undefined) return ({status: "error"});

		const resGetTE: GetTournamentEliminationResult =  await this._teTab.getTEByid(resCreatTE.data.lastID);
		if (resGetTE.status != "success" ) return ({status: "error"});


		const te : TournamentElimination = resGetTE.data;
		const paramList: addTEPlayer[] = listIdUser.map((idU, _) =>
			{
				return {
					tournament_elimination_id :te.id,
					user_id: idU,
					maxRound: getMaxRounds(listIdUser.length)
				}});

		const resAddPlayers: AddTEPlayerResult = await this._tePlayerTab.addTEPlayers(paramList);
		if (resAddPlayers.status != "allSuccess") return convertAddTEPlayerResultToAddResult(resAddPlayers);
		const resAddTEMatch : AddTEMatchResult = await this._teMatchTab.addTEMatchsFromTE(te);

		return (convertAddTEMatchResultToAddResult(resAddTEMatch));
	}

	private async getTEMatchPlayers(te: TournamentElimination, matchIndex: number): Promise<{status: "no_winner_yet" | "success" | "error" | "matchIndex_not_valide", jL?: TEPlayer, jR?: TEPlayer }>
	{
		const totalMatches : number = te.nbr_participant-1;
		if (matchIndex <= 0 || matchIndex > totalMatches)
			return ({status:"matchIndex_not_valide"});

		const leafCount : number = Math.floor(te.nbr_participant / 2);
		const firstLeafMatch = totalMatches - leafCount + 1;
		const leafIdx = matchIndex - firstLeafMatch;

		// recuperer enfant de gauche
		let jl : TEPlayer;
		const matchIndexLeft = matchIndex * 2;
		if (matchIndexLeft > totalMatches) {// alors y a pas de match à gauche
			const leftPlayerNumber  = leafIdx * 2  + 1;
			const resGetPlayerL : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndIdInTE(te.id, leftPlayerNumber);
			if (resGetPlayerL.status != "success" ) return ({status: "error"});
			jl = resGetPlayerL.data;
		}
		else
		{
			const resGetTEMatchL : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexLeft);
			if (resGetTEMatchL.status != "success" ) return ({status: "error"});
			if (resGetTEMatchL.data.winner_id == undefined) return ({status: "no_winner_yet"});
			const resGetPlayerL : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndUserid(te.id, resGetTEMatchL.data.winner_id);
			if (resGetPlayerL.status != "success" ) return ({status: "error"});
			jl = resGetPlayerL.data;
		}
		// recuperer enfant de droite
		let jr : TEPlayer;
		const matchIndexRight = matchIndexLeft + 1;
		if (matchIndexRight > totalMatches) {// alors y a pas de match à droite
			const rightPlayerNumber  = leafIdx * 2  + 1 + 1;
			const resGetPlayerR : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndIdInTE(te.id, rightPlayerNumber);
			if (resGetPlayerR.status != "success" ) return ({status: "error"});
			jr = resGetPlayerR.data;
		}
		else
		{
			const resGetTEMatchR : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexRight);
			if (resGetTEMatchR.status != "success" ) return ({status: "error"});
			if (resGetTEMatchR.data.winner_id == undefined) return ({status: "no_winner_yet"});
			const resGetPlayerR : GetTEPlayerResult = await this._tePlayerTab.getTEPlayerByTEidAndUserid(te.id, resGetTEMatchR.data.winner_id);
			if (resGetPlayerR.status != "success" ) return ({status: "error"});
			jr = resGetPlayerR.data;
		}

		return {status : "success", jL: jl, jR: jr};
	}


	public async startTEMatch(idTE: number, matchIndexInTournament : number): Promise<AddResult>
	{
		const resGetTE: GetTournamentEliminationResult =  await this._teTab.getTEByid(idTE);
		if (resGetTE.status != "success" ) return ({status: "error"});

		const te = resGetTE.data;

		const resGetJlAndJR = await this.getTEMatchPlayers(te, matchIndexInTournament);
		if (resGetJlAndJR.status != "success") return ({ status: resGetJlAndJR.status});
		else if (resGetJlAndJR.jL == undefined ||resGetJlAndJR.jR == undefined)  return ({status: "error"});

		const resAddAndStartMatch = await this.addAndStartMatch(resGetJlAndJR.jL.user_id, resGetJlAndJR.jR.user_id);
		if (resAddAndStartMatch.status != "success") return (resAddAndStartMatch);
		else if (resAddAndStartMatch.data.lastID == undefined)  return ({status: "error"});

		const idMatch = resAddAndStartMatch.data.lastID;
		const resGetTEMatchL : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexInTournament);
		if (resGetTEMatchL.status != "success" ) return ({status: "error"});
		
		const res : UpdateTEMatchResult = await this._teMatchTab.updateMatchid(resGetTEMatchL.data, idMatch);
		return (convertUpdateToAddResult(res));
	}

	public async endTEMatch(idTE: number, matchIndexInTournament : number): Promise<UpdateResult>
	{
		const resGetTE: GetTournamentEliminationResult =  await this._teTab.getTEByid(idTE);
		if (resGetTE.status != "success" ) return ({status: "error"});

		const te = resGetTE.data;
		const resGetTEMatch : GetTEMatchResult = await this._teMatchTab.getTEMatchByTEidAndOrder(te.id, matchIndexInTournament);
		if (resGetTEMatch.status != "success" ) return ({status: "error"});
		else if (resGetTEMatch.data.match_id == undefined ) return ({status: "no_match_found"});

		const resGetMatch = await this._matchTab.getMatchById(resGetTEMatch.data.match_id);
		if (resGetMatch.status != "success" ) return ({status: "error"});

		const idWinner = resGetMatch.data.player_1_score >= resGetMatch.data.player_2_score ? 
		resGetMatch.data.player_1_id 
		: resGetMatch.data.player_2_id;

		return (convertUpdateTEMatchToUpdateResult(await this._teMatchTab.markWinner(resGetTEMatch.data, idWinner)));
	}

	// passe aux round suivant si toute les personne du meme round on fini leur match sinon c'est pas fini

	// Recupere le nombre de ligne pour chaque tableaux

	// Recuperer x ligne combientieme fois y exemple je recupere 10 ligne à partir de de la 3 iem repitiontion donc va donne la ligne 30 à 40 du tablaux choisi

	// recupere un element preci individuelle de chaque tableaux
}