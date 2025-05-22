import { GameConfig } from './Types';
import { Ball } from './Ball.js';
import { Paddle } from './Paddle.js';

export class Renderer {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private config: GameConfig;
	private ball: Ball;
	private paddle1: Paddle;
	private paddle2: Paddle;

	constructor(
		canvasId: string,
		config: GameConfig,
		ball: Ball,
		paddle1: Paddle,
		paddle2: Paddle
	) {
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.config = config;
		this.ball = ball;
		this.paddle1 = paddle1;
		this.paddle2 = paddle2;
		this.initializeCanvas();
	}

	private initializeCanvas(): void {
		this.canvas.width = this.config.canvasWidth;
		this.canvas.height = this.config.canvasHeight;
	}

	clear(): void {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	getContext(): CanvasRenderingContext2D {
		return this.context;
	}

	getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}

	render(): void {
		this.clear();
		this.ball.draw();
		this.paddle1.draw();
		this.paddle2.draw();
	}
}
