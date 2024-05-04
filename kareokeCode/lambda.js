const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async (event, context) => {
    let browser = null;
    let result = null;

    try {
        const executablePath = await chromium.executablePath;
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(event.queryStringParameters.playlistUrl, { waitUntil: 'networkidle2' });

        // Scroll and extract items from the page.
        result = await page.evaluate(async () => {
            const scrollableSection = document.querySelector('body');

            let items = [];
            try {
                let previousHeight;
                while (items.length < 1000) { // replace 1000 with any large number that's greater than total songs in the playlist
                    items = Array.from(document.querySelectorAll('a.trackItem__trackTitle.sc-link-dark.sc-link-primary.sc-font-light')).map(songElement => songElement.innerText);
                    previousHeight = scrollableSection.scrollHeight;
                    window.scrollTo(0, previousHeight);
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for a second for the new songs to load
                    if (previousHeight === scrollableSection.scrollHeight) {
                        break;
                    }
                }
            } catch (err) {
                console.log('Scrolling failed:', err);
            }
            return items;
        });
    } catch (error) {
        console.error(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};
