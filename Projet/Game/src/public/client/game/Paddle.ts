import { Position, Velocity, c, canvas } from './Consts';

export class Paddle {
	position: Position;
	velocity: Velocity;
	width: number;
	height: number;

	constructor({ position }: { position: Position }) {
		this.position = position;
		this.velocity = { x: 0, y: 0 };
		this.width = 10;
		this.height = 100;
	}

	draw(): void {
		c.fillStyle = 'black';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update(): void {
		this.draw();
		if (
			this.position.y + this.velocity.y > 0 &&
			this.position.y + this.height + this.velocity.y < canvas.height
		) {
			this.position.y += this.velocity.y;
		}
	}
}
