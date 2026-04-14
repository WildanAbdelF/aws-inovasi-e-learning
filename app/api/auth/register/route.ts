import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";
import { setAuthCookies } from "@/lib/authCookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabaseAuth = getSupabaseAuthClient();
  const supabaseAdmin = getSupabaseAdmin();

  if (!supabaseAuth || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const { data: signUpData, error: signUpError } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (signUpError || !signUpData.user) {
    return NextResponse.json(
      { error: signUpError?.message || "Failed to register user." },
      { status: 400 }
    );
  }

  const role = email === "admin@example.com" ? "admin" : "user";

  const { error: upsertError } = await supabaseAdmin.from("users").upsert(
    {
      id: signUpData.user.id,
      name,
      email,
      role,
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  let session = signUpData.session;
  if (!session) {
    const { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      return NextResponse.json(
        {
          data: {
            id: signUpData.user.id,
            name,
            email,
            role,
          },
          sessionEstablished: false,
          message:
            "Registration succeeded. Please verify your email before login if confirmation is enabled.",
        },
        { status: 201 }
      );
    }

    session = signInData.session;
  }

  const response = NextResponse.json(
    {
      data: {
        id: signUpData.user.id,
        name,
        email,
        role,
      },
      sessionEstablished: Boolean(session),
    },
    { status: 201 }
  );

  if (session) {
    setAuthCookies(response, session, request);
  }

  return response;
}
