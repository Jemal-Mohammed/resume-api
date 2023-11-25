import { join } from 'path';

/**
 * @type {import("puppeteer").Configuration}
 */
export default {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '/opt/render/.cache/puppeteer', 'puppeteer'),
};
