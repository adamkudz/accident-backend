import * as fs from "fs/promises";
import * as path from "path";

export async function makeAccidentMap(fileDir) {
    console.log("making accident map");
    let files = await fs.readdir(fileDir);

    let linkMaps = [];

    for (let file of files) {
        let jsonFile = JSON.parse(
            await fs.readFile(path.join(fileDir, file), "utf-8")
        );

        if (jsonFile.length) {
            let linkMap = new Map();
            let _links = [];
            let _title;
            for (let data of jsonFile) {
                if (data["link"]) {
                    _title = data["title"];
                    _title = _title
                        .replace(/[()]/g, "")
                        .trim()
                        .replace(/[/,. :]/g, "-")
                        .toLowerCase();
                    _links.push({
                        title: _title,
                        link: data["link"],
                        fileType: data["link"].slice(-3).toLowerCase(),
                    });
                }
            }
            linkMap.set("folder", file.split(".")[0]);

            linkMap.set("links", _links);
            linkMaps.push(linkMap);
        }
    }
    return linkMaps;
}
