const isDocker = require("is-docker");
const puppeteer = require("puppeteer");

/**
 * Parse a dataURL into a Buffer with its mime type
 * Source: https://intoli.com/blog/saving-images/
 * @param {String} dataUrl - dataURL String
 * @returns {object}
 */
const parseDataUrl = (dataUrl) => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error("Could not parse data URL.");
  }
  return { mime: matches[1], buffer: Buffer.from(matches[2], "base64") };
};

/**
 * Open a URL in puppeteer, put in some configuration, click a button, then grab an image from
 * a newly created DOM node.
 * @param {string} url - The URL you want Puppeteer to visit
 * @param {string} outputSelector - CSS selector for the element that is created when the generation
 * is complete. Should be an anchor tag with a DataURL in the `href` attribute.
 * @param {string} metaDataSelector - CSS selector for the element that holds stringified metadata
 * about the generated media.
 * @param {String} captionSelector - The CSS selector for the metadata caption
 * @returns {Promise<Object>}
 */
const getGeneratedImageData = async (
  url,
  outputSelector,
  metaDataSelector,
  captionSelector
) => {
  const browser = await puppeteer.launch({
    headless: true,
    // If we're inside a docker container, use --no-sandbox
    args: isDocker() ? ["--no-sandbox"] : [],
  });
  const page = await browser.newPage();
  await page.goto(url);
  const selectorOptions = { timeout: 2000 };
  try {
    await Promise.all([
      page.waitForSelector(captionSelector, selectorOptions),
      page.waitForSelector(metaDataSelector, selectorOptions),
      page.waitForSelector(outputSelector, selectorOptions),
    ]);
  } catch (error) {
    // If the selectors time out, then assume a failure and throw the error
    console.error(error);
    await browser.close();
    throw error;
  }
  const imageData = await page
    .$(outputSelector)
    .then((link) => link.getProperty("href"))
    .then((dataUrlHandle) => dataUrlHandle.jsonValue())
    .then(parseDataUrl);
  const metaData = await page
    .$(metaDataSelector)
    .then((para) => para.getProperty("textContent"))
    .then((textHandle) => textHandle.jsonValue())
    .then((json) => JSON.parse(json));
  const caption = await page
    .$(captionSelector)
    .then((para) => para.getProperty("textContent"))
    .then((textHandle) => textHandle.jsonValue());
  await browser.close();
  return {
    imageData,
    metaData,
    caption,
  };
};

/**
 * Return {imageData, metaData, caption} fom a URL given the right selectors
 * @param {String} url - The URL puppeteer should visit
 * @param {String} outputLinkSelector - The CSS selector for the link to the generated media
 * @param {String} metaDataSelector - The CSS selector for the stringified metadata
 * @param {String} captionSelector - The CSS selector for the metadata caption
 * @returns {Promise<Object>}
 */
const generateEmojiScene = async (
  url,
  outputLinkSelector,
  metaDataSelector,
  captionSelector
) => {
  return getGeneratedImageData(
    url,
    outputLinkSelector,
    metaDataSelector,
    captionSelector
  );
};

module.exports = {
  generateEmojiScene,
};
