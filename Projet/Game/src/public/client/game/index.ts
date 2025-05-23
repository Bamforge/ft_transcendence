import { Game } from './Game.js';
import { GameConfig } from './Types.js';

const gameConfig: GameConfig = {
	canvasWidth: 1000,
	canvasHeight: 500,
	paddleWidth: 10,
	paddleHeight: 100,
	ballSize: 10,
	paddleSpeed: 6,
	ballSpeed: 4,
};

const game = new Game('gameCanvas', gameConfig);
game.start();
