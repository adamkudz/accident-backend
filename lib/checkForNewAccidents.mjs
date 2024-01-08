import { scrapeRawData } from "./scrapeRawData.mjs";
import { extractVehicles } from "./extractVehicles.mjs";
import { getDatabaseAccidents } from "./getDatabaseAccidents.mjs";
import { getAccidentIds } from "./getAccidentIds.mjs";

export async function checkForNewAccidents(
    ntsbUrl,
    config,
    rawFolder,
    rawFileName
) {
    console.log("checking for new accidents");
    let newAccidents = [];
    try {
        await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);

        let dbAccidents = await getDatabaseAccidents();

        let rawData = await extractVehicles(rawFolder);

        let scrapedAccidentIds = await getAccidentIds(rawFolder, rawFileName);

        let _newAccidents = scrapedAccidentIds.filter(
            (x) => !dbAccidents.includes(x)
        );

        _newAccidents.forEach((accident) => {
            let newAccidentData = rawData.filter(
                (data) => data.NtsbNumber === accident
            );
            newAccidents.push(...newAccidentData);
        });
        return { newAccidents, scrapedAccidentIds };
    } catch (err) {
        console.error(err);
    }
}
