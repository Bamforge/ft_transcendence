import { jest } from '@jest/globals';

// Mock Renderer
export const mockRender = jest.fn();
export const mockRenderer = {
    __esModule: true,
    Renderer: jest.fn().mockImplementation(() => ({
        render: mockRender
    }))
};
