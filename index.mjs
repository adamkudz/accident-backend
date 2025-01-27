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
        let rawPath = process.cwd() + `/${rawFolder}`;
        await fspromises.access(rawPath, fspromises.constants.F_OK);
        const rawStats = await fspromises.stat(rawPath);
        if (rawStats.isDirectory()) {
            await fspromises.rm(rawPath, { recursive: true });
            console.log("raw directory deleted");
        } else {
            console.log("no raw directory");
        }
    } catch {
        console.error("no raw directory");
    }
    try {
        let referencePath = process.cwd() + `/${referenceFolder}`;
        await fspromises.access(referencePath, fspromises.constants.F_OK);
        const referenceStats = await fspromises.stat(referencePath);
        if (referenceStats.isDirectory()) {
            await fspromises.rm(referencePath, { recursive: true });
            console.log("reference directory deleted");
        } else {
            console.log("no reference directory");
        }
    } catch {
        console.error("no reference directory");
    }
    try {
        let accidentPath = process.cwd() + `/${accidentFolder}`;
        await fspromises.access(accidentPath, fspromises.constants.F_OK);
        const accidentStats = await fspromises.stat(accidentPath);
        if (accidentStats.isDirectory()) {
            await fspromises.rm(accidentPath, { recursive: true });
            console.log("accident directory deleted");
        } else {
            console.log("no accident directory");
        }
    } catch {
        console.error("no accident directory");
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
        }
    } catch (err) {
        console.error(err);
    }
}

async function checkCompletionStatus() {
    console.log("checking completion status");

    await deleteDirectories(rawFolder, referenceFolder, accidentFolder);

    try {
        let completedAccidents = [];
        await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);
        let rawData = await extractVehicles(rawFolder);
        let incompleteAccidentsIds = await getDatabaseIncompleteIds(dbName);

        console.log(
            incompleteAccidentsIds.length + " incomplete accidents in database"
        );
        console.log(incompleteAccidentsIds);
        incompleteAccidentsIds.forEach((id) => {
            let accident = rawData.find(
                (accident) => accident.NtsbNumber === id
            );

            if (accident.CompletionStatus === "Completed") {
                completedAccidents.push(accident);
                console.log(accident.NtsbNumber + " is completed");
            }
        });
        if (completedAccidents.length === 0) {
            console.log("No accidents to update");
            return;
        } else {
            console.log(completedAccidents.length + " accidents to update");
            await scrapeReferenceLinksAndWrite(
                completedAccidents,
                referenceFolder
            );
            let accidentMap = await makeAccidentMap(`${referenceFolder}`);
            await downloadReferenceFiles(accidentMap, accidentFolder);
            await uploadAccidentReferencesToS3(accidentFolder, s3Bucket);
            completedAccidents.forEach(async (accident) => {
                let links = await fspromises.readFile(
                    `./${referenceFolder}/${accident.NtsbNumber}.json`
                );
                accident.reference_links = JSON.parse(links);

                await deleteDatabaseAccident(accident.NtsbNumber, dbName);
                console.log("accident deleted");
                await uploadToSupabase(accident, dbName);
                console.log("Accident updated");
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

await checkCompletionStatus();
