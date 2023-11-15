import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();
const url = `${process.env.DB_URL}`;
const publicAnonKey = `${process.env.DB_ANON_KEY}`;
const supabase = createClient(url, publicAnonKey);

export async function uploadToSupabase(body) {
    console.log("uploading to supabase");

    try {
        const { data, error } = await supabase
            .from("tbm-accidents")
            .insert(body, { ignoreDuplicates: true })
            .select();
        if (error) throw error;
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}
