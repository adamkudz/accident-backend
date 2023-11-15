import { scrapeRawData } from "./lib/scrapeRawData.mjs";
import { extractVehicles } from "./lib/extractVehicles.mjs";
import { scrapeReferenceLinks } from "./lib/scrapeReferenceLinks.mjs";
import { downloadReferenceFiles } from "./lib/downloadReferenceFiles.mjs";
import { getAccidentIds } from "./lib/getAccidentIds.mjs";
import { makeAccidentMap } from "./lib/makeAccidentMap.mjs";
import { uploadToSupabase } from "./lib/uploadToSupabase.mjs";

import * as fspromises from "fs/promises";
import { get } from "http";

const ntsbUrl = "https://www.ntsb.gov/Pages/AviationQueryv2.aspx";
const referenceFolder = "reference-links";
const rawFolder = "raw-cases";
const rawFileName = "pilatus-raw-cases.json";
const accidentFolder = "accidents";
const config = {
    date: "01/01/2019",
    model: "tbm",
    country: "United States",
};

async function deleteDirectories(rawFolder, referenceFolder, accidentFolder) {
    console.log("deleting directories");
    try {
        await fspromises.rm(process.cwd() + `/${referenceFolder}`, {
            recursive: true,
        });
        await fspromises.rm(process.cwd() + `/${rawFolder}`, {
            recursive: true,
        });
        await fspromises.rm(process.cwd() + `/${accidentFolder}`, {
            recursive: true,
        });
    } catch (err) {
        console.error(err);
    }
}

await deleteDirectories(rawFolder, referenceFolder, accidentFolder);

await fspromises.mkdir(`${referenceFolder}`, { recursive: true });

await scrapeRawData(ntsbUrl, config, rawFolder, rawFileName);

let rawData = await extractVehicles(rawFolder);

const supabaseResponse = await uploadToSupabase(await rawData);
console.log("supabaseResponse", supabaseResponse);

let accidentIds = await getAccidentIds(rawFolder, rawFileName);

await scrapeReferenceLinks(accidentIds, referenceFolder);

let accidentMap = await makeAccidentMap(`${referenceFolder}`);

await downloadReferenceFiles(accidentMap, accidentFolder);
