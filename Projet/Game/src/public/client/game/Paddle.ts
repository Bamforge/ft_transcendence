import { Position, Velocity } from './Types.js';

export class Paddle {
	position: Position;
	velocity: Velocity;
	width: number;
	height: number;
	private context: CanvasRenderingContext2D;

	constructor(
		{ position }: { position: Position },
		context: CanvasRenderingContext2D,
		width: number,
		height: number,
		speed: number
	) {
		this.position = position;
		this.velocity = { x: 0, y: 0 };
		this.width = width;
		this.height = height;
		this.context = context;
	}

	draw(): void {
		this.context.fillStyle = 'black';
		this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update(canvasHeight: number): void {
		this.draw();
		this.position.y += this.velocity.y;

		if (this.position.y + this.height >= canvasHeight) {
			this.position.y = canvasHeight - this.height;
		}

		if (this.position.y <= 0) {
			this.position.y = 0;
		}
	}
}
