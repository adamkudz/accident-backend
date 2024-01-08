import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { link } from "fs";
import * as fspromises from "fs/promises";
import * as fs from "fs";
config();
const url = `${process.env.DB_URL}`;
const publicAnonKey = `${process.env.DB_ANON_KEY}`;
const supabase = createClient(url, publicAnonKey);

let links = await fspromises.readdir("./reference-links");
links.forEach(async (link) => {
    let file = fs.readFileSync("./reference-links/" + link);
    let fileString = JSON.parse(file);
    console.log(link, fileString);
    try {
        const { data: databaseAccidents, error } = await supabase
            .from("tbm-accidents")
            .update({ reference_links: fileString })
            .eq("NtsbNumber", link.split(".")[0])
            .select();
        if (error) throw error;
        console.log("databaseAccidents", databaseAccidents);
    } catch (err) {
        console.log(err);
    }
});
