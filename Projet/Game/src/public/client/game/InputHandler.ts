import { Paddle } from './Paddle.js';

export class InputHandler {
	private paddleOne: Paddle;
	private paddleTwo: Paddle;
	private speed: number;

	constructor(paddleOne: Paddle, paddleTwo: Paddle, speed: number) {
		this.paddleOne = paddleOne;
		this.paddleTwo = paddleTwo;
		this.speed = speed;
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		window.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'ArrowUp':
					this.paddleOne.velocity.y = -this.speed;
					break;
				case 'ArrowDown':
					this.paddleOne.velocity.y = this.speed;
					break;
				case 'w':
					this.paddleTwo.velocity.y = -this.speed;
					break;
				case 's':
					this.paddleTwo.velocity.y = this.speed;
					break;
			}
		});

		window.addEventListener('keyup', (e) => {
			if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
				this.paddleOne.velocity.y = 0;
			}
			if (e.key === 'w' || e.key === 's') {
				this.paddleTwo.velocity.y = 0;
			}
		});
	}
}
