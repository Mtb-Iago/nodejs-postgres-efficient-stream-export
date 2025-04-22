/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  // Marca arquivos .ts como ESM
  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },

  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: './tsconfig.json'
    }
  },

  // Suporte ao import.meta.url e top-level await
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  setupFiles: ['./jest.setup.ts']
};
