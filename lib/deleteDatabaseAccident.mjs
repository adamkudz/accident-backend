import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();
const url = `${process.env.DB_URL}`;
const publicAnonKey = `${process.env.DB_ANON_KEY}`;
const supabase = createClient(url, publicAnonKey);

export async function deleteDatabaseAccident(accidentId, dbName) {
    try {
        let { error } = await supabase
            .from(`${dbName}`)
            .delete()
            .eq("NtsbNumber", accidentId);

        if (error) return error;
    } catch (err) {
        console.error(err);
    }
}
