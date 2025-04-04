// Add TextEncoder and TextDecoder which are required by some dependencies
// but not available in the Jest environment
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Add missing fetch and Response globals required by MSW
global.fetch = require('node-fetch');
global.Request = require('node-fetch').Request;
global.Response = require('node-fetch').Response;
global.Headers = require('node-fetch').Headers;

// Mock BroadcastChannel for MSW
global.BroadcastChannel = class {
  constructor() {
    this.name = null;
    this.onmessage = null;
  }
  postMessage() {}
  close() {}
};

// Mock implementation for window.matchMedia which is required by some UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 