import { chromium } from "playwright";
export async function scrapeRawData(url, config, folder, fileName) {
    try {
        console.log("scraping raw data");
        const browser = await chromium.launch({
            headless: false,
            slowMo: 50,
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);

        await page
            .locator("id=ctl00_PlaceHolderMain_AviationHome1_txtEventStartDate")
            .fill(`${config.date}`);

        await page
            .locator("id=ctl00_PlaceHolderMain_AviationHome1_txtModel")
            .fill(`${config.model}`);

        await page
            .locator("id=ctl00_PlaceHolderMain_AviationHome1_ddlCountry")
            .selectOption(`${config.country}`);

        await page
            .locator("id=ctl00_PlaceHolderMain_AviationHome1_btnSubmit")
            .click();

        const downloadPromise = page.waitForEvent("download");

        await page.getByRole("link").filter({ hasText: "JSON" }).click();

        const download = await downloadPromise;

        await download.saveAs(`./${folder}/${fileName}`);

        await browser.close();
        console.log("raw data scraped");
    } catch (err) {
        console.error(err);
    }
}
