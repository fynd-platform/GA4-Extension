import { isNode } from 'browser-or-node';
import browserEngine from './rest/browser.engine';
import serverEngine from './rest/server.engine';

const ApiService = isNode ? serverEngine : browserEngine;

export default ApiService;
