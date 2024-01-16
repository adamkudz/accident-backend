/// <reference types="@aws-sdk/types" />
import fs from "fs";

import {
    S3Client,
    PutObjectCommand,
    CreateBucketCommand,
} from "@aws-sdk/client-s3";

async function uploadDailyToS3(file) {
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
async function uploadAccidentReferencesToS3(folder, bucket) {
    try {
        const s3 = new S3Client({ region: "us-east-1" });
        s3.send(
            new CreateBucketCommand({
                Bucket: `${bucket}`,
            })
        );
        const folders = await fs.promises.readdir(`./${folder}/`);
        for (const accidentNum of folders) {
            const files = await fs.promises.readdir(
                `./${folder}/${accidentNum}`
            );

            for (const file of files) {
                s3.send(
                    new PutObjectCommand({
                        Bucket: `${bucket}`,
                        Key: `accidents/${accidentNum}/${file}`,
                        Body: file,
                    })
                )
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log("s3 error catch", err);
                    });
            }
        }
    } catch (err) {
        console.log(err);
    }
}

export { uploadDailyToS3, uploadAccidentReferencesToS3 };
