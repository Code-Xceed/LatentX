import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/components/marketplace/gig-card";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function MarketplacePage() {
    const supabase = await createClient();

    // Fetch gigs with freelancer profiles
    const { data: gigs } = await supabase
        .from("gigs")
        .select("*, profiles(*)")
        .order("created_at", { ascending: false });

    // Check if user is a freelancer to show "Post Gig" button
    const { data: { user } } = await supabase.auth.getUser();
    let isFreelancer = false;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        isFreelancer = profile?.role === "freelancer";
    }

    return (
        <div className="container py-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-medium">Marketplace</h1>
                    <p className="text-muted-foreground max-w-xl">
                        Discover top-tier services from expert freelancers. From web development to creative design, find everything you need.
                    </p>
                </div>
                {isFreelancer && (
                    <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                        <Link href="/marketplace/new">
                            <Plus className="mr-2 h-4 w-4" /> Post a Gig
                        </Link>
                    </Button>
                )}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search services..."
                        className="pl-10 border-none shadow-none focus-visible:ring-0 bg-transparent"
                    />
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <Button variant="ghost" className="text-gray-500 hover:text-emerald-700">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>

            {/* Gigs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gigs && gigs.length > 0 ? (
                    gigs.map((gig) => (
                        <GigCard key={gig.id} gig={gig} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        <p className="text-lg">No gigs found yet.</p>
                        <p className="text-sm">Be the first to post a service!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
