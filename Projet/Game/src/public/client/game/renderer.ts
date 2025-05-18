import { c, canvas } from './Consts';
import { paddleOne, paddleTwo, ball } from './Game';

export function animate(): void {
	requestAnimationFrame(animate);
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);
	paddleOne.update();
	paddleTwo.update();
	ball.update();
}
