"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const signupSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(6),
});

const verifySchema = z.object({
    email: z.string().email(),
    token: z.string().min(6, "Token must be 6 digits"),
});

export async function login(formData: FormData) {
    const supabase = await createClient();
    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
    });

    if (error) {
        return { error: error.message };
    }

    // Check if user has a profile/role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile?.role) {
            redirect("/onboarding");
        }
    }

    redirect("/workspace");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const data = Object.fromEntries(formData);
    const parsed = signupSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input" };
    }

    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: {
                full_name: parsed.data.full_name,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function verifyOtp(formData: FormData) {
    const supabase = await createClient();
    const data = Object.fromEntries(formData);
    const parsed = verifySchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid input" };
    }

    const { error } = await supabase.auth.verifyOtp({
        email: parsed.data.email,
        token: parsed.data.token,
        type: "signup",
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/onboarding");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}
