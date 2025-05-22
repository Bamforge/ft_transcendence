import { jest } from '@jest/globals';
import { mockRenderer } from './mocks.js';

// Create mock context directly
const mockContext = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    width: 800,
    height: 600
};

// Create mock canvas
const mockCanvas = {
    getContext: jest.fn().mockReturnValue(mockContext),
    width: 800,
    height: 600
};

// Mock window methods
window.requestAnimationFrame = (callback) => {
    callback(0);
    return 0;
};

// Mock document methods
document.getElementById = jest.fn().mockImplementation((id) => {
    if (id === 'gameCanvas') {
        return mockCanvas;
    }
    return null;
});

// Mock window event listeners
window.addEventListener = jest.fn();
window.removeEventListener = jest.fn();

// Mock Renderer
const mockRender = jest.fn();
jest.mock('../public/client/game/Renderer', () => ({
    __esModule: true,
    Renderer: jest.fn().mockImplementation(() => ({
        render: mockRender
    }))
}));

// Export mock objects for use in tests
export { mockCanvas, mockContext, mockRender };
