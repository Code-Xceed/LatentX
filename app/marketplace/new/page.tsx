import { GigForm } from "@/components/marketplace/gig-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewGigPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is a freelancer
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "freelancer") {
        redirect("/marketplace");
    }

    return (
        <div className="container py-12">
            <div className="max-w-2xl mx-auto mb-8 text-center">
                <h1 className="text-4xl font-serif font-medium mb-4">Post a New Gig</h1>
                <p className="text-muted-foreground">
                    Showcase your skills and start earning. Create a detailed gig to attract the right clients.
                </p>
            </div>
            <GigForm />
        </div>
    );
}
