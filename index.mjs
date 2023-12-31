import { scrapeRawData } from "./lib/scrapeRawData.mjs";
import { extractVehicles } from "./lib/extractVehicles.mjs";
import { scrapeReferenceLinks } from "./lib/scrapeReferenceLinks.mjs";
import { downloadReferenceFiles } from "./lib/downloadReferenceFiles.mjs";
import { getDatabaseAccidentIds } from "./lib/getDatabaseAccidentIds.mjs";
import { getScrapedAccidentIds } from "./lib/getScrapedAccidentIds.mjs";
import { makeAccidentMap } from "./lib/makeAccidentMap.mjs";
import { uploadToSupabase } from "./lib/uploadToSupabase.mjs";
import { checkForNewAccidents } from "./lib/checkForNewAccidents.mjs";

import * as fspromises from "fs/promises";

const ntsbUrl = "https://www.ntsb.gov/Pages/AviationQueryv2.aspx";
const referenceFolder = "reference-links";
const rawFolder = "raw-cases";
const rawFileName = "tbm-raw-cases.json";
const accidentFolder = "accidents";
const dbName = "tbm-accidents";
const config = {
    date: "01/01/1992",
    model: "tbm",
    country: "United States",
};

async function deleteDirectories(rawFolder, referenceFolder, accidentFolder) {
    console.log("deleting directories");
    try {
        if (
            (
                await fspromises.readFile(
                    process.cwd() + `/${rawFolder}/${rawFileName}`
                )
            ).length > 0
        ) {
            console.log("raw folder exists...deleting");
            await fspromises.rm(process.cwd() + `/${rawFolder}`, {
                recursive: true,
            });
        }

        if (
            (await fspromises.readdir(process.cwd() + `/${accidentFolder}`))
                .length > 0
        ) {
            console.log("accident folder exists...deleting");
            await fspromises.rm(process.cwd() + `/${accidentFolder}`, {
                recursive: true,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function getNewAccidents() {
    try {
        let { newAccidents, scrapedAccidentIds } = await checkForNewAccidents(
            ntsbUrl,
            config,
            rawFolder,
            rawFileName,
            dbName
        );

        if (newAccidents.length > 0) {
            console.log(newAccidents.length + " new accidents found");
            let supabaseResponse = await uploadToSupabase(newAccidents, dbName);
            console.log(supabaseResponse.length + " new accidents uploaded");
            await fspromises.rm(process.cwd() + `/${rawFolder}`, {
                recursive: true,
            });
        } else {
            console.log("No new accidents to upload");
            await fspromises.rm(process.cwd() + `/${rawFolder}`, {
                recursive: true,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

await getNewAccidents();

// await fspromises.mkdir(`${referenceFolder}`, { recursive: true });

// await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);

// await extractVehicles(rawFolder);

// let accidentIds = await getAccidentIds(rawFolder, rawFileName);

// await scrapeReferenceLinks(accidentIds, referenceFolder);

// let accidentMap = await makeAccidentMap(`${referenceFolder}`);

// await downloadReferenceFiles(accidentMap, accidentFolder);
