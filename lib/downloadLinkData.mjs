import https from "https";
import * as fs from "fs";
export async function downloadLinkData(folderName, fileName, link, fileType) {
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
                console.log("done");
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
