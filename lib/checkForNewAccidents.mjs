import { scrapeRawData } from "./scrapeRawData.mjs";
import { extractVehicles } from "./extractVehicles.mjs";
import { getDatabaseAccidentIds } from "./getDatabaseAccidentIds.mjs";
import { getScrapedAccidentIds } from "./getScrapedAccidentIds.mjs";

export async function checkForNewAccidents(
    ntsbUrl,
    config,
    rawFolder,
    rawFileName,
    dbName
) {
    console.log("checking for new accidents");
    let invalidModels = ["GRUMMAN", "BOMBARDIER", "Beech", "Grumman"];
    let newAccidents = [];
    try {
        await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);

        let dbAccidentIds = await getDatabaseAccidentIds(dbName);

        let rawData = await extractVehicles(rawFolder);

        let scrapedAccidentIds = await getScrapedAccidentIds(
            rawFolder,
            rawFileName
        );

        let _newAccidents = scrapedAccidentIds.filter(
            (x) => !dbAccidentIds.includes(x)
        );

        _newAccidents.forEach((accident) => {
            let newAccidentData = rawData.filter(
                (data) => data.NtsbNumber === accident
            );
            if (!invalidModels.includes(newAccidentData[0].Make))
                newAccidents.push(...newAccidentData);
        });
        return { newAccidents, scrapedAccidentIds };
    } catch (err) {
        console.error(err);
    }
}
