import { Position } from './Types.js';

export class Score {
	private score1: number;
	private score2: number;
	private context: CanvasRenderingContext2D;
	private position1: Position;
	private position2: Position;
	private font: string;
	private color: string;

	constructor(context: CanvasRenderingContext2D, canvasWidth: number) {
		this.score1 = 0;
		this.score2 = 0;
		this.context = context;
		this.font = '48px Arial';
		this.color = 'black';

		// Position scores on opposite sides of the canvas
		this.position1 = {
			x: canvasWidth / 4,
			y: 50,
		};
		this.position2 = {
			x: (canvasWidth / 4) * 3,
			y: 50,
		};
	}

	draw(): void {
		this.context.font = this.font;
		this.context.fillStyle = this.color;
		this.context.textAlign = 'center';

		// Draw player 1 score
		this.context.fillText(this.score1.toString(), this.position1.x, this.position1.y);

		// Draw player 2 score
		this.context.fillText(this.score2.toString(), this.position2.x, this.position2.y);
	}

	incrementScore(player: 1 | 2): void {
		if (player === 1) {
			this.score1++;
		} else {
			this.score2++;
		}
	}

	getScore(player: 1 | 2): number {
		return player === 1 ? this.score1 : this.score2;
	}

	reset(): void {
		this.score1 = 0;
		this.score2 = 0;
	}
}
