import { jest } from '@jest/globals';

export const Renderer = jest.fn().mockImplementation(() => ({
    render: jest.fn()
}));
