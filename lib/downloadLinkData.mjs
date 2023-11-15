import https from "https";
import * as fs from "fs";
export async function downloadLinkData(folderName, fileName, link, fileType) {
    try {
        const writeStream = fs.createWriteStream(
            `./accidents/${folderName}/${fileName}.${fileType}`
        );

        console.time(`from-download ${fileName}`);
        console.time(`writing ${fileName}`);
        let backCount = 0;
        https.get(`${link}`, (res) => {
            res.on("data", (chunk) => {
                writeStream.write(chunk);
            });

            writeStream.on("drain", () => {
                res.resume();
            });
            res.on("end", async () => {
                console.log("done");
                console.timeEnd(`from-download ${fileName}`);
                console.timeEnd(`writing ${fileName}`);
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
