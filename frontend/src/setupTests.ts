// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Import React to make it available globally for JSX
import React from 'react';
// @ts-ignore
global.React = React;

// Mock localStorage for tests
class LocalStorageMock {
  store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

// @ts-ignore
global.localStorage = new LocalStorageMock();

// We'll add MSW setup later when we need to test API calls
// For now, let's focus on component tests 