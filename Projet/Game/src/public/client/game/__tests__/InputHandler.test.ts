import { jest } from '@jest/globals';
import { InputHandler } from '../InputHandler.js';
import { Paddle } from '../Paddle.js';

describe('InputHandler', () => {
    let inputHandler: InputHandler;
    let mockPaddle1: Paddle;
    let mockPaddle2: Paddle;
    let keydownHandler: (e: KeyboardEvent) => void;
    let keyupHandler: (e: KeyboardEvent) => void;

    beforeEach(() => {
        mockPaddle1 = {
            velocity: { x: 0, y: 0 },
        } as unknown as Paddle;

        mockPaddle2 = {
            velocity: { x: 0, y: 0 },
        } as unknown as Paddle;

        // Mock window.addEventListener to capture the handlers
        window.addEventListener = jest.fn((event, handler) => {
            if (event === 'keydown') {
                keydownHandler = handler as (e: KeyboardEvent) => void;
            } else if (event === 'keyup') {
                keyupHandler = handler as (e: KeyboardEvent) => void;
            }
        });

        inputHandler = new InputHandler(mockPaddle1, mockPaddle2, 5);
    });

    test('should move paddle1 up on ArrowUp keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        keydownHandler(event);
        expect(mockPaddle1.velocity.y).toBe(-5);
    });

    test('should move paddle1 down on ArrowDown keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        keydownHandler(event);
        expect(mockPaddle1.velocity.y).toBe(5);
    });

    test('should move paddle2 up on w keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 'w' });
        keydownHandler(event);
        expect(mockPaddle2.velocity.y).toBe(-5);
    });

    test('should move paddle2 down on s keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 's' });
        keydownHandler(event);
        expect(mockPaddle2.velocity.y).toBe(5);
    });

    test('should stop paddle1 on ArrowUp keyup', () => {
        mockPaddle1.velocity.y = -5;
        const event = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        keyupHandler(event);
        expect(mockPaddle1.velocity.y).toBe(0);
    });

    test('should stop paddle1 on ArrowDown keyup', () => {
        mockPaddle1.velocity.y = 5;
        const event = new KeyboardEvent('keyup', { key: 'ArrowDown' });
        keyupHandler(event);
        expect(mockPaddle1.velocity.y).toBe(0);
    });

    test('should stop paddle2 on w keyup', () => {
        mockPaddle2.velocity.y = -5;
        const event = new KeyboardEvent('keyup', { key: 'w' });
        keyupHandler(event);
        expect(mockPaddle2.velocity.y).toBe(0);
    });

    test('should stop paddle2 on s keyup', () => {
        mockPaddle2.velocity.y = 5;
        const event = new KeyboardEvent('keyup', { key: 's' });
        keyupHandler(event);
        expect(mockPaddle2.velocity.y).toBe(0);
    });
});
