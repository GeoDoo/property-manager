module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
    "@/(.*)$": "<rootDir>/src/$1",
    "^@fontsource/.*$": "identity-obj-proxy",
    "^.+\\.mp4$": "<rootDir>/src/__mocks__/fileMock.js",
    "^\\$app/(.*)$": "<rootDir>/src/__mocks__/app/$1.js",
    "^\\$env/(.*)$": "<rootDir>/src/__mocks__/env/$1.js",
    "^virtual:(.*)$": "identity-obj-proxy",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^store/(.*)$": "<rootDir>/src/store/$1"
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@fontsource|@dnd-kit|uuid)/)"
  ],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/**/*.stories.{js,jsx,ts,tsx}",
    "!<rootDir>/src/**/*.mock.{js,jsx,ts,tsx}",
    "!<rootDir>/src/**/*.test.{js,jsx,ts,tsx}",
    "!<rootDir>/src/test/**/*",
    "!<rootDir>/src/services/**/*",
    "!<rootDir>/src/mocks/**/*",
    "!<rootDir>/src/__mocks__/**/*",
    "!<rootDir>/src/vite-env.d.ts",
    "!<rootDir>/src/main.tsx",
    "!<rootDir>/src/App.tsx"
  ],
  coverageThreshold: {
    "src/components/Property/PropertyDetails.tsx": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}; 