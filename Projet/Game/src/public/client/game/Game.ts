import { Paddle } from './Paddle';
import { Ball } from './Ball';
// Import initCanvas and other necessary items from Consts
import { initCanvas, canvas, c } from './Consts';
import { inputHandler } from './inputHandler';
import { animate } from './renderer';

// *** Call initCanvas() at the very beginning of your game script execution ***
// This ensures it runs after game.ejs's content (including the canvas) is in the DOM
// and this script (game.js) is being executed.
initCanvas();

console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeere');

// Now you can safely define objects that depend on canvas dimensions
export const paddleOne = new Paddle({
	position: {
		x: 10,
		y: 100,
	},
});

export const paddleTwo = new Paddle({
	position: {
		x: canvas.width - 20, // Safe to access canvas.width
		y: 100,
	},
});

export const ball = new Ball({
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2,
	},
});

inputHandler; // Make sure event listeners are attached
animate(); // Start the game loop
