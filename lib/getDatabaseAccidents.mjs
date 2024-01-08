import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();
const url = `${process.env.DB_URL}`;
console.log("url", url);

const publicAnonKey = `${process.env.DB_ANON_KEY}`;

const supabase = createClient(url, publicAnonKey);
export async function getDatabaseAccidents() {
    try {
        let { data: databaseAccidents, error } = await supabase
            .from("tbm-accidents")
            .select(`NtsbNumber`);
        if (error) throw error;
        let accidentIds = databaseAccidents.map(
            (accident) => accident.NtsbNumber
        );
        return accidentIds;
    } catch (err) {
        console.error(err);
    }
}
