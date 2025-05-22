export interface Position {
	x: number;
	y: number;
}

export interface Velocity {
	x: number;
	y: number;
}

export interface GameConfig {
	canvasWidth: number;
	canvasHeight: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleSpeed: number;
	ballSize: number;
	ballSpeed: number;
}
