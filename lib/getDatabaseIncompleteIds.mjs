import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();
const url = `${process.env.DB_URL}`;

const publicAnonKey = `${process.env.DB_ANON_KEY}`;

const supabase = createClient(url, publicAnonKey);
export async function getDatabaseIncompleteIds(dbName) {
    try {
        let { data: databaseIncomplete, error } = await supabase
            .from(`${dbName}`)
            .select("*")
            .eq("CompletionStatus", "In work");

        if (error) throw error;

        return databaseIncomplete.map((accident) => accident.NtsbNumber);
    } catch (err) {
        console.error(err);
    }
}
