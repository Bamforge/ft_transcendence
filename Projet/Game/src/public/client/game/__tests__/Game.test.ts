import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { Game } from '../Game.js';
import { GameConfig } from '../Types.js';
import { Ball } from '../Ball.js';
import { Paddle } from '../Paddle.js';
import { Score } from '../Score.js';

// Create a mock renderer class
class MockRenderer {
    render() {}
}

// Mock the Renderer module
jest.mock('../Renderer', () => {
    return {
        Renderer: MockRenderer
    };
});

describe('Game', () => {
    let game: Game;
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;
    let config: GameConfig;
    let renderSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        mockCanvas = document.createElement('canvas');
        mockContext = {
            clearRect: jest.fn(),
            fillStyle: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            textAlign: '',
        } as unknown as CanvasRenderingContext2D;

        Object.defineProperty(mockCanvas, 'getContext', {
            value: () => mockContext
        });

        // Mock document.getElementById
        const originalGetElementById = document.getElementById;
        document.getElementById = (id: string) => {
            if (id === 'gameCanvas') {
                return mockCanvas;
            }
            return null;
        };

        config = {
            canvasWidth: 800,
            canvasHeight: 600,
            paddleWidth: 10,
            paddleHeight: 100,
            paddleSpeed: 5,
            ballSize: 10,
            ballSpeed: 5
        };

        game = new Game('gameCanvas', config);
        renderSpy = jest.spyOn((game as any).renderer, 'render');

        // Restore original getElementById
        document.getElementById = originalGetElementById;
    });

    test('should initialize with correct components', () => {
        expect(game.ball).toBeInstanceOf(Ball);
        expect(game.paddle1).toBeInstanceOf(Paddle);
        expect(game.paddle2).toBeInstanceOf(Paddle);
        expect(game.score).toBeInstanceOf(Score);
    });

    test('should update game state', () => {
        const initialBallX = game.ball.position.x;
        const initialBallY = game.ball.position.y;

        game.update();

        expect(game.ball.position.x).not.toBe(initialBallX);
        expect(game.ball.position.y).not.toBe(initialBallY);
    });

    test('should render game', () => {
        game.render();
        expect(renderSpy).toHaveBeenCalled();
    });

    test('should handle game loop', () => {
        const updateSpy = jest.spyOn(game, 'update');
        const renderSpy = jest.spyOn(game, 'render');

        // Mock requestAnimationFrame to prevent infinite loop
        const originalRAF = window.requestAnimationFrame;
        let rafCallback: FrameRequestCallback = () => {};
        window.requestAnimationFrame = (callback) => {
            rafCallback = callback;
            return 0;
        };

        game.gameLoop();
        rafCallback(0);

        expect(updateSpy).toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalled();

        // Restore original requestAnimationFrame
        window.requestAnimationFrame = originalRAF;
    });
});
