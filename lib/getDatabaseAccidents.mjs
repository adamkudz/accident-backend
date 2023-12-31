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
            .select(`*`);
        if (error) throw error;

        return databaseAccidents;
    } catch (err) {
        console.error(err);
    }
}
