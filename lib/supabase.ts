import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
	supabaseUrl && supabaseServiceRoleKey
);

let supabaseAdmin: SupabaseClient | null = null;

if (isSupabaseConfigured) {
	supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}

export function getSupabaseAdmin(): SupabaseClient | null {
	return supabaseAdmin;
}
