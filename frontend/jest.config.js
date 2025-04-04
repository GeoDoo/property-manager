module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/jest.setup.js'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/Button.tsx',
    'src/components/ImageSlider.tsx',
    'src/components/Property/Filter.tsx',
    'src/components/Property/PropertyCard.tsx'
  ],
  coverageThreshold: {
    'src/components/Button.tsx': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/components/ImageSlider.tsx': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/components/Property/Filter.tsx': {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: 80,
    },
    'src/components/Property/PropertyCard.tsx': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}; 