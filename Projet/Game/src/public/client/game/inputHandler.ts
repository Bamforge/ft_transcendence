import { paddleOne, paddleTwo } from './Game';

export const inputHandler = addEventListener('keydown', (event: KeyboardEvent) => {
	const speed = 6;
	switch (event.key) {
		case 'w':
			paddleOne.velocity.y = -speed;
			break;
		case 's':
			paddleOne.velocity.y = speed;
			break;
		case 'ArrowUp':
			paddleTwo.velocity.y = -speed;
			break;
		case 'ArrowDown':
			paddleTwo.velocity.y = speed;
			break;
	}
});
