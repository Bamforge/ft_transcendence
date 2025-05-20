export interface Position {
	x: number;
	y: number;
}

export type Velocity = {
	x: number;
	y: number;
};

// Declare them but don't assign immediately
export let canvas: HTMLCanvasElement;
export let c: CanvasRenderingContext2D;

// Add an initializer function
export function initCanvas(): void {
	const canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
	if (!canvasElement) {
		throw new Error('CRITICAL: Canvas element with id "gameCanvas" not found in the DOM.');
	}
	canvas = canvasElement;

	const context = canvas.getContext('2d');
	if (!context) {
		throw new Error('CRITICAL: Failed to get 2D rendering context for the canvas.');
	}
	c = context;

	canvas.width = 1000;
	canvas.height = 500;
}
