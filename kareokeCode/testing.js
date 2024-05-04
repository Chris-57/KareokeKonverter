const puppeteer = reuire('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://soundcloud.com/chris-meumann/sets/chris1')

    const songs = await page.evaluate(() => {
        const songElements = Array.from(document.querySelectorAll('a.trackItem__trackTitle.sc-link-primary.sc-font-light'));
        return songElements.map(songElement => {
            const titleAndArtist = songElement.innerText;
            return [titleAndArtists];
    
        });
    });

    console.log(songs);
    await browser.close();
})