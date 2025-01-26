/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@rollup/rollup-linux-x64-gnu$': '<rootDir>/__mocks__/rollupMock.js'
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
                jsx: 'react-jsx'
            }
        ]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons'],
    },
    moduleDirectories: ['node_modules', 'src'],
    globals: {
        'import.meta': {
            env: {
                VITE_API_URL: 'http://mock-api'
            }
        }
    }
}
