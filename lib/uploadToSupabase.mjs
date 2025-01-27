import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();
const url = `${process.env.DB_URL}`;
const publicAnonKey = `${process.env.DB_ANON_KEY}`;
const supabase = createClient(url, publicAnonKey);

export async function uploadToSupabase(body, dbName) {
    console.log("uploading to supabase");

    try {
        const { error } = await supabase
            .from(`${dbName}`)
            .insert(body, { ignoreDuplicates: true })
            .select();

        if (error) throw error;
        return body;
    } catch (err) {
        console.error(err);
    }
}
