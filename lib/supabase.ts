import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
	process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const supabaseAnonKey =
	process.env.SUPABASE_ANON_KEY ||
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	process.env.SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
	supabaseUrl && supabaseServiceRoleKey
);

export const isSupabaseAuthConfigured = Boolean(
	supabaseUrl && supabaseAnonKey
);

let supabaseAdmin: SupabaseClient | null = null;
let supabaseAuthClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
	supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}

if (isSupabaseAuthConfigured) {
	supabaseAuthClient = createClient(supabaseUrl!, supabaseAnonKey!, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}

export function getSupabaseAdmin(): SupabaseClient | null {
	return supabaseAdmin;
}

export function getSupabaseAuthClient(): SupabaseClient | null {
	return supabaseAuthClient;
}
