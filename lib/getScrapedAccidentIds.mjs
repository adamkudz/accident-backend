import { readFile } from "fs/promises";
export async function getScrapedAccidentIds(folder, fileName) {
    try {
        let invalidModels = ["GRUMMAN", "grumman", "BOMBARDIER", "Beech"];
        console.log("getting accident ids");
        const accidentsCases = await readFile(
            `./${folder}/${fileName}`,
            "utf-8"
        );

        const accidents = JSON.parse(accidentsCases);
        const accidentIds = accidents
            .map((accident) => accident.NtsbNumber)
            .filter((accident) => !invalidModels.includes(accident));
        return accidentIds;
    } catch (err) {
        console.error(err);
    }
}
