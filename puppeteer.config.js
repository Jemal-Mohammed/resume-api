// const puppeteer = require('puppeteer-core');
import puppeteer from 'puppeteer-core';
async function configurePuppeteer() {
  const executablePath = process.env.CHROMIUM_PATH || await puppeteer.executablePath();
  return { executablePath };
}

export default configurePuppeteer;
