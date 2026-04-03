import { createClient } from "@supabase/supabase-js";

// Mengambil variabel dari .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Inisialisasi Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
