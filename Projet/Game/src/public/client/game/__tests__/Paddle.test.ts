import { jest } from '@jest/globals';
import { Paddle } from '../Paddle.js';

describe('Paddle', () => {
    let paddle: Paddle;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
        } as unknown as CanvasRenderingContext2D;

        paddle = new Paddle(
            { position: { x: 0, y: 100 } },
            mockContext,
            10,
            100,
            5
        );
    });

    test('should initialize with correct position and size', () => {
        expect(paddle.position).toEqual({ x: 0, y: 100 });
        expect(paddle.width).toBe(10);
        expect(paddle.height).toBe(100);
        expect(paddle.velocity).toEqual({ x: 0, y: 0 });
    });

    test('should draw paddle', () => {
        paddle.draw();
        expect(mockContext.fillStyle).toBe('black');
        expect(mockContext.fillRect).toHaveBeenCalledWith(0, 100, 10, 100);
    });

    test('should update position within canvas bounds', () => {
        paddle.velocity.y = 5;
        paddle.update(500);
        expect(paddle.position.y).toBe(105);
    });

    test('should not move below canvas bottom', () => {
        paddle.position.y = 400;
        paddle.velocity.y = 5;
        paddle.update(500);
        expect(paddle.position.y).toBe(400);
    });

    test('should not move above canvas top', () => {
        paddle.position.y = 0;
        paddle.velocity.y = -5;
        paddle.update(500);
        expect(paddle.position.y).toBe(0);
    });
});
