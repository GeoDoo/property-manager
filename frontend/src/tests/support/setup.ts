import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator; 