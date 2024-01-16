import * as fs from "fs";
import * as https from "https";
import * as fspromises from "fs/promises";

async function downloadLinkData(folderName, fileName, link, fileType) {
    try {
        const writeStream = fs.createWriteStream(
            `./accidents/${folderName}/${fileName}.${fileType}`
        );

        https.get(`${link}`, (res) => {
            res.on("data", (chunk) => {
                writeStream.write(chunk);
            });

            writeStream.on("drain", () => {
                res.resume();
            });
            res.on("end", async () => {
                console.log("done downloading " + fileName);
            });

            writeStream.on("finish", () => {
                console.log("finished");
            });
            writeStream.on("error", (err) => {
                console.log(err);
            });
            writeStream.on("close", () => {
                console.log("closed");
            });
        });
    } catch (err) {
        console.log(err);
    }
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

export async function downloadReferenceFiles(accidentMap, folder) {
    async function downloadLinks(files, folder) {
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
    try {
        await downloadLinks(accidentMap, folder).then(() => {
            console.log("finished downloading");
        });
    } catch (err) {
        console.log(err);
    }
}
