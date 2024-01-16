import { scrapeRawData } from "./lib/scrapeRawData.mjs";
import { extractVehicles } from "./lib/extractVehicles.mjs";
import { scrapeReferenceLinksAndWrite } from "./lib/scrapeReferenceLinksAndWrite.mjs";
import { downloadReferenceFiles } from "./lib/downloadReferenceFiles.mjs";
import { getDatabaseAccidentIds } from "./lib/getDatabaseAccidentIds.mjs";
import { getScrapedAccidentIds } from "./lib/getScrapedAccidentIds.mjs";
import { makeAccidentMap } from "./lib/makeAccidentMap.mjs";
import { uploadToSupabase } from "./lib/uploadToSupabase.mjs";
import { checkForNewAccidents } from "./lib/checkForNewAccidents.mjs";
import { getDatabaseIncompleteIds } from "./lib/getDatabaseIncompleteIds.mjs";
import { uploadAccidentReferencesToS3 } from "./lib/storage.mjs";

import * as fspromises from "fs/promises";
import { deleteDatabaseAccident } from "./lib/deleteDatabaseAccident.mjs";

const ntsbUrl = "https://www.ntsb.gov/Pages/AviationQueryv2.aspx";
const referenceFolder = "reference-links";
const rawFolder = "raw-cases";
const rawFileName = "tbm-raw-cases.json";
const accidentFolder = "accidents";
const s3Bucket = "tbm-accidents";
const dbName = "tbm-accidents_duplicate";
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

async function checkCompletionStatus() {
    try {
        let completedAccidents = [];
        await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);
        let rawData = await extractVehicles(rawFolder);
        let incompleteAccidentsIds = await getDatabaseIncompleteIds(dbName);

        console.log(incompleteAccidentsIds.length + " incomplete accidents");
        incompleteAccidentsIds.forEach((id) => {
            let accident = rawData.find(
                (accident) => accident.NtsbNumber === id
            );

            if (accident.CompletionStatus === "Completed") {
                completedAccidents.push(accident);
            }
        });
        await fspromises.rm(process.cwd() + `/${rawFolder}`, {
            recursive: true,
        });
        if (completedAccidents.length === 0) {
            console.log("No accidents to update");
            return;
        } else {
            await scrapeReferenceLinks(
                completedAccidents[0].NtsbNumber,
                referenceFolder
            );
            let accidentMap = await makeAccidentMap(`${referenceFolder}`);
            await downloadReferenceFiles(accidentMap, accidentFolder);
            completedAccidents.forEach(async (accident) => {
                await deleteDatabaseAccident(accident.NtsbNumber, dbName);
                console.log("accident deleted");
                let supabaseResponse = await uploadToSupabase(accident, dbName);
                console.log(supabaseResponse + " accident updated");
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// await scrapeReferenceLinksAndWrite(
//     completedAccidents[0].NtsbNumber,
//     referenceFolder
// );
// let accidentMap = await makeAccidentMap(`${referenceFolder}`);
// await downloadReferenceFiles(accidentMap, accidentFolder);

// await checkCompletionStatus();

// completedAccidents.forEach(async (accident) => {
//     await deleteDatabaseAccident(accident.NtsbNumber, `${dbName}`);
//     console.log("accident deleted");
//     let supabaseResponse = await uploadToSupabase(accident, dbName);
//     console.log(supabaseResponse + " accident updated");
// });

// await scrapeReferenceLinksAndWrite(completedAccidents[0].NtsbNumber, referenceFolder);

// await getNewAccidents();

async function getAllAccidents() {
    try {
        // await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);

        // let accidentIds = await getScrapedAccidentIds(rawFolder, rawFileName);

        // await scrapeReferenceLinksAndWrite(accidentIds, referenceFolder);

        // let accidentMap = await makeAccidentMap(`${referenceFolder}`);

        // await downloadReferenceFiles(accidentMap, accidentFolder);
        await uploadAccidentReferencesToS3(accidentFolder, s3Bucket);
    } catch (err) {
        console.error(err);
    }
}

await getAllAccidents();
