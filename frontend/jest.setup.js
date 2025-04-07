// Add TextEncoder and TextDecoder which are required by some dependencies
// but not available in the Jest environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add missing fetch and Response globals required by MSW
const { fetch, Request, Response, Headers } = require('node-fetch');
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

// Mock BroadcastChannel for MSW
global.BroadcastChannel = class {
  constructor() {
    this.name = 'mockChannel';
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

// Mock implementation for window.matchMedia which is required by some UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 