/// <reference types="@aws-sdk/types" />
import fs from "fs";
import * as fspromises from "fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// import { uploadToS3 } from "./storage.mjs";

const fileDir = await fspromises.readdir("./daily");
let oldFile = "";
let newFile = "";
let allFiles = [];
fileDir.forEach((file) => {
    if (file.includes("tbm-accidents.csv")) {
        let fileDate = file.split("-")[0];
        if (allFiles.length === 0) {
            allFiles.push({ fileDate, file });
            return;
        }
        if (fileDate > allFiles[allFiles.length - 1].fileDate) {
            allFiles.unshift({ fileDate, file });
            return;
        }
    }
});

newFile = allFiles[0].file;
console.log(newFile);
// oldFile = allFiles[1].file;

await uploadToS3(newFile);

async function uploadToS3(file) {
    try {
        const s3 = new S3Client({ region: "us-east-1" });
        console.time("upload");
        s3.send(
            new PutObjectCommand({
                Bucket: "nxi-pdf-test",
                Key: `daily/${file}`,
                Body: fs.createReadStream(`./daily/${file}`),
                Metadata: {
                    "Content-Type": "text/csv",
                },
            })
        ).then((data) => {
            console.log(data);
            console.timeEnd("upload");
        });
    } catch (err) {
        console.log(err);
    }
}
