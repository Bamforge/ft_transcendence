import { jest } from '@jest/globals';
import { Ball } from '../Ball.js';
import { Paddle } from '../Paddle.js';
import { Score } from '../Score.js';

describe('Ball', () => {
    let ball: Ball;
    let mockPaddle1: Paddle;
    let mockPaddle2: Paddle;
    let mockScore: Score;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
        } as unknown as CanvasRenderingContext2D;

        mockPaddle1 = {
            position: { x: 0, y: 100 },
            width: 10,
            height: 100,
        } as unknown as Paddle;

        mockPaddle2 = {
            position: { x: 790, y: 100 },
            width: 10,
            height: 100,
        } as unknown as Paddle;

        mockScore = {
            incrementScore: jest.fn(),
        } as unknown as Score;

        ball = new Ball(
            { position: { x: 400, y: 300 } },
            mockContext,
            10,
            5,
            mockScore
        );
    });

    test('should initialize with correct properties', () => {
        expect(ball.position.x).toBe(400);
        expect(ball.position.y).toBe(300);
        expect(ball.width).toBe(10);
        expect(ball.height).toBe(10);
    });

    test('should move ball', () => {
        const initialX = ball.position.x;
        const initialY = ball.position.y;

        ball.update(800, 600, mockPaddle1, mockPaddle2);

        expect(ball.position.x).not.toBe(initialX);
        expect(ball.position.y).not.toBe(initialY);
    });

    test('should bounce off top and bottom walls', () => {
        ball.position.y = 0;
        ball.velocity.y = -5;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(ball.velocity.y).toBe(5);

        ball.position.y = 600;
        ball.velocity.y = 5;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(ball.velocity.y).toBe(-5);
    });

    test('should bounce off paddles', () => {
        // Test paddle1 collision
        ball.position.x = 10;
        ball.position.y = 150;
        ball.velocity.x = -5;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(ball.velocity.x).toBe(5);

        // Test paddle2 collision
        ball.position.x = 780;
        ball.position.y = 150;
        ball.velocity.x = 5;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(ball.velocity.x).toBe(-5);
    });

    test('should increment score when ball goes past paddle1', () => {
        ball.position.x = -10;
        ball.velocity.x = -5;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(mockScore.incrementScore).toHaveBeenCalledWith(2);
    });

    test('should increment score when ball goes past paddle2', () => {
        ball.position.x = 810;
        ball.velocity.x = 5;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(mockScore.incrementScore).toHaveBeenCalledWith(1);
    });

    test('should reset ball position after scoring', () => {
        ball.position.x = -10;
        ball.update(800, 600, mockPaddle1, mockPaddle2);
        expect(ball.position.x).toBe(400);
        expect(ball.position.y).toBe(300);
    });
});
