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
    "<rootDir>/src/components/Property/PropertyDetails.tsx",
    "<rootDir>/src/components/Property/Filter.tsx",
    "<rootDir>/src/components/Property/PropertyCard.tsx",
    "<rootDir>/src/components/ImageSlider.tsx",
    "<rootDir>/src/components/Layout/Layout.tsx",
    "<rootDir>/src/components/Layout/Navigation.tsx",
    "<rootDir>/src/components/Button.tsx",
    "<rootDir>/src/components/ErrorBoundary/ErrorBoundary.tsx",
    "<rootDir>/src/components/ErrorBoundary/withErrorBoundary.tsx"
  ],
  coverageReporters: ["lcov", "text", "json-summary"],
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