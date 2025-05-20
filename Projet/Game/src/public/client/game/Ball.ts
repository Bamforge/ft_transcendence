import { Position, Velocity, c, canvas } from './Consts';
import { paddleOne, paddleTwo } from './Game';

export class Ball {
	position: Position;
	velocity: Velocity;
	width: number;
	height: number;

	constructor({ position }: { position: Position }) {
		this.position = position;
		const speed = 4;
		const direction = {
			x: Math.random() - 0.5 >= 0 ? -speed : speed,
			y: Math.random() - 0.5 >= 0 ? -speed : speed,
		};
		this.velocity = direction;
		this.width = 10;
		this.height = 10;
	}

	draw(): void {
		c.fillStyle = 'black';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update(): void {
		this.draw();
		const rightSide = this.position.x + this.width + this.velocity.x;
		const leftSide = this.position.x + this.velocity.x;
		const bottomSide = this.position.y + this.height;
		const topSide = this.position.y;

		if (
			leftSide <= paddleOne.position.x + paddleOne.width &&
			bottomSide >= paddleOne.position.y &&
			topSide <= paddleOne.position.y + paddleOne.height
		) {
			this.velocity.x = -this.velocity.x;
		}

		if (
			rightSide >= paddleTwo.position.x &&
			bottomSide >= paddleTwo.position.y &&
			topSide <= paddleTwo.position.y + paddleTwo.height
		) {
			this.velocity.x = -this.velocity.x;
		}

		if (
			this.position.y + this.height + this.velocity.y >= canvas.height ||
			this.position.y + this.velocity.y <= 0
		) {
			this.velocity.y = -this.velocity.y;
		}

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
