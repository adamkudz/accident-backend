/// <reference types="@aws-sdk/types" />
import fs from "fs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

export { uploadToS3 };
