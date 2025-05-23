import { Position, Velocity } from './Types.js';
import { Paddle } from './Paddle.js';
import { Score } from './Score.js';

export class Ball {
	position: Position;
	velocity: Velocity;
	width: number;
	height: number;
	private context: CanvasRenderingContext2D;
	private score: Score;

	constructor(
		{ position }: { position: Position },
		context: CanvasRenderingContext2D,
		size: number,
		speed: number,
		score: Score
	) {
		this.position = position;
		const direction = {
			x: Math.random() - 0.5 >= 0 ? -speed : speed,
			y: Math.random() - 0.5 >= 0 ? -speed : speed,
		};
		this.velocity = direction;
		this.width = size;
		this.height = size;
		this.context = context;
		this.score = score;
	}

	draw(): void {
		this.context.fillStyle = 'black';
		this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	reset(canvasWidth: number, canvasHeight: number): void {
		this.position = {
			x: canvasWidth / 2,
			y: canvasHeight / 2,
		};
		this.velocity = {
			x: Math.random() - 0.5 >= 0 ? -Math.abs(this.velocity.x) : Math.abs(this.velocity.x),
			y: Math.random() - 0.5 >= 0 ? -Math.abs(this.velocity.y) : Math.abs(this.velocity.y),
		};
	}

	update(canvasWidth: number, canvasHeight: number, paddle1: Paddle, paddle2: Paddle): void {
		this.draw();
		const rightSide = this.position.x + this.width + this.velocity.x;
		const leftSide = this.position.x + this.velocity.x;
		const bottomSide = this.position.y + this.height;
		const topSide = this.position.y;

		// Check if ball goes past paddles
		if (rightSide >= canvasWidth) {
			this.score.incrementScore(1);
			this.reset(canvasWidth, canvasHeight);
			return;
		}
		if (leftSide <= 0) {
			this.score.incrementScore(2);
			this.reset(canvasWidth, canvasHeight);
			return;
		}

		// Collision with paddle1
		if (
			leftSide <= paddle1.position.x + paddle1.width &&
			bottomSide >= paddle1.position.y &&
			topSide <= paddle1.position.y + paddle1.height
		) {
			this.velocity.x = -this.velocity.x;
		}

		// Collision with paddle2
		if (
			rightSide >= paddle2.position.x &&
			bottomSide >= paddle2.position.y &&
			topSide <= paddle2.position.y + paddle2.height
		) {
			this.velocity.x = -this.velocity.x;
		}

		// Reverse vertical direction at top and bottom edges
		if (
			this.position.y + this.height + this.velocity.y >= canvasHeight ||
			this.position.y + this.velocity.y <= 0
		) {
			this.velocity.y = -this.velocity.y;
		}

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
