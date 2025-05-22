import { GameConfig } from './Types.js';
import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';
import { InputHandler } from './InputHandler.js';
import { Renderer } from './Renderer.js';
import { Score } from './Score.js';

export class Game {
	public ball: Ball;
	public paddle1: Paddle;
	public paddle2: Paddle;
	public score: Score;
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private inputHandler: InputHandler;
	private animationFrameId: number | null = null;
	private renderer: Renderer;
	private config: GameConfig;

	constructor(canvasId: string, config: GameConfig) {
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.canvas.width = config.canvasWidth;
		this.canvas.height = config.canvasHeight;
		this.context = this.canvas.getContext('2d')!;
		this.config = config;

		// Initialize score
		this.score = new Score(this.context, this.canvas.width);

		// Initialize game objects
		this.ball = new Ball(
			{ position: { x: this.canvas.width / 2, y: this.canvas.height / 2 } },
			this.context,
			this.config.ballSize,
			this.config.ballSpeed,
			this.score
		);

		this.paddle1 = new Paddle(
			{ position: { x: 0 + 5, y: 100 } },
			this.context,
			this.config.paddleWidth,
			this.config.paddleHeight,
			this.config.paddleSpeed
		);

		this.paddle2 = new Paddle(
			{ position: { x: this.canvas.width - this.config.paddleWidth - 5, y: 100 } },
			this.context,
			this.config.paddleWidth,
			this.config.paddleHeight,
			this.config.paddleSpeed
		);

		this.inputHandler = new InputHandler(this.paddle2, this.paddle1, this.config.paddleSpeed);
		this.renderer = new Renderer(canvasId, this.config, this.ball, this.paddle1, this.paddle2);
	}

	update(): void {
		this.ball.update(this.canvas.width, this.canvas.height, this.paddle1, this.paddle2);
		this.paddle1.update(this.canvas.height);
		this.paddle2.update(this.canvas.height);
	}

	render(): void {
		this.renderer.render();
		this.score.draw();
	}

	gameLoop(): void {
		this.update();
		this.render();
		requestAnimationFrame(() => this.gameLoop());
	}

	start(): void {
		this.gameLoop();
	}
}
