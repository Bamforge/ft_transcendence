import { jest } from '@jest/globals';
import { Score } from '../Score.js';

describe('Score', () => {
    let score: Score;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
        mockContext = {
            fillStyle: '',
            textAlign: '',
            fillText: jest.fn(),
        } as unknown as CanvasRenderingContext2D;

        score = new Score(mockContext, 1000);
    });

    test('should initialize with zero scores', () => {
        expect(score.getScore(1)).toBe(0);
        expect(score.getScore(2)).toBe(0);
    });

    test('should increment player 1 score', () => {
        score.incrementScore(1);
        expect(score.getScore(1)).toBe(1);
        expect(score.getScore(2)).toBe(0);
    });

    test('should increment player 2 score', () => {
        score.incrementScore(2);
        expect(score.getScore(1)).toBe(0);
        expect(score.getScore(2)).toBe(1);
    });

    test('should reset scores', () => {
        score.incrementScore(1);
        score.incrementScore(2);
        score.reset();
        expect(score.getScore(1)).toBe(0);
        expect(score.getScore(2)).toBe(0);
    });

    test('should draw scores', () => {
        score.incrementScore(1);
        score.incrementScore(2);
        score.draw();
        expect(mockContext.fillText).toHaveBeenCalledTimes(2);
        expect(mockContext.fillText).toHaveBeenCalledWith('1', 250, 50);
        expect(mockContext.fillText).toHaveBeenCalledWith('1', 750, 50);
    });
});
