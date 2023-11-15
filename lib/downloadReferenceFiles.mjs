import * as fs from "fs";
import * as https from "https";
import * as fspromises from "fs/promises";

import { downloadLinkData } from "./downloadLinkData.mjs";

export async function downloadReferenceFiles(accidentMap, folder) {
    async function scrapeReferenceLinks(files, folder) {
        files.forEach(async (map) => {
            try {
                await createFolder(map.get("folder"), folder);
                let folderName = map.get("folder");
                let links = map.get("links");
                console.log("Folder Name", folderName);

                console.log("links", links);

                links.forEach(async (link) => {
                    await downloadLinkData(
                        folderName,
                        link.title,
                        link.link,
                        link.fileType
                    );
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
    async function createFolder(folderName, folder) {
        try {
            await fspromises.mkdir(process.cwd() + `/${folder}/${folderName}`, {
                recursive: true,
            });
        } catch (err) {
            console.log(err);
        }
    }
    await scrapeReferenceLinks(accidentMap, folder);
}
