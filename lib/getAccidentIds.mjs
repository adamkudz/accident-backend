import { readFile } from "fs/promises";
export async function getAccidentIds(folder, fileName) {
    console.log("getting accident ids");
    const accidentsCases = await readFile(`./${folder}/${fileName}`, "utf-8");

    const accidents = JSON.parse(accidentsCases);
    const accidentIds = accidents.map((accident) => accident.NtsbNumber);
    return accidentIds;
}
