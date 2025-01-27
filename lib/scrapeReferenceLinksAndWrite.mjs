import { firefox } from "playwright";
import { writeFile, readFile, mkdir } from "fs/promises";
import * as fspromises from "fs/promises";
//This function takes reads accident Ids from the raw-cases/tbm-raw-cases.json file, and scrapes the NTSB website for the accident's docket and
// writes the titles and links to a json file stored in the referenceLinks folder.
async function writeLinksToFolder(accidents, referenceFolder) {
    const accidentId = accidents.NtsbNumber;
    console.log("downloading reference links");

    await mkdir(referenceFolder, { recursive: true });
    try {
        const browser = await firefox.launch({ headless: false, slowMo: 50 });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(
            `https://data.ntsb.gov/Docket/?NTSBNumber=${accidentId}`
        );
        const tableText = await page.getByRole("row").allInnerTexts();
        const referenceTitles = tableText
            .map((text) => {
                return text.split("\t")[1];
            })
            .splice(6);

        const allBlobLinks = await page.evaluate(() => {
            const links = Array.from(
                document.querySelectorAll('a[target="_blank"]')
            );
            return links.map((link) => link.href);
            // .filter((x) => x.includes("https://data.ntsb.gov/"));
        });

        const descriptionsAndLinks = referenceTitles.map((title, index) => {
            return { title: title, link: allBlobLinks[index] };
        });

        async function writeDataToJson() {
            try {
                await writeFile(
                    `./${referenceFolder}/${accidentId}.json`,
                    JSON.stringify(descriptionsAndLinks)
                );
                console.log(
                    "Data written to file",
                    referenceFolder,
                    accidentId
                );
            } catch (err) {
                console.log(err);
            }
        }

        await writeDataToJson();
        await browser.close();
    } catch (err) {
        console.error(err);
    }
}

export async function scrapeReferenceLinksAndWrite(completedAccidents, folder) {
    for (let accidents of completedAccidents) {
        await writeLinksToFolder(accidents, folder);
    }
}
