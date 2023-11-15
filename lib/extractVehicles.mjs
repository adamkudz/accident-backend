import * as fspromises from "fs/promises";
export async function extractVehicles(folder) {
    console.log("extracting vehicles");
    try {
        let files = await fspromises.readdir(`./${folder}`);
        let filtered = files.filter((file) => file.includes("json"));
        if (filtered.length === 0) {
            console.log("No new files to convert");
            return;
        }
        let json = await fspromises.readFile(
            `./${folder}/` + filtered[0],
            "utf-8"
        );
        let parsedData = await JSON.parse(json);

        for (let i = 0; i < parsedData.length; i++) {
            let accident = parsedData[i];
            let veh = accident.Vehicles[0];
            for (const [key, value] of Object.entries(veh)) {
                accident[key] = value;
            }
            delete accident.Vehicles;
        }
        return parsedData;
    } catch (err) {
        console.error(err);
        return err;
    }
}
