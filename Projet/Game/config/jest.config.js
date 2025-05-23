/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    testMatch: [
        "**/__tests__/**/*.ts",
        "**/?(*.)+(spec|test).ts"
    ],
    rootDir: '../',
    moduleFileExtensions: ['ts', 'js'],
    testPathIgnorePatterns: ['/node_modules/'],
};
