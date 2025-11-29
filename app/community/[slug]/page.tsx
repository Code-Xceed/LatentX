import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/community/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, MessageSquare, Plus } from "lucide-react";

export default async function CommunityDetailPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { slug } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch community details
    const { data: community } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!community) {
        notFound();
    }

    // Fetch posts for this community
    const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(*), communities(*)")
        .eq("community_id", community.id)
        .order("created_at", { ascending: false });

    return (
        <div className="container py-12">
            {/* Community Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 rounded-2xl bg-emerald-100 text-emerald-700 text-3xl border-4 border-white shadow-sm">
                        <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-serif font-bold">c/{community.name}</h1>
                        <p className="text-muted-foreground">{community.description}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full">Joined</Button>
                    <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                        <Plus className="mr-2 h-4 w-4" /> Create Post
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} currentUserId={user?.id} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                            <p className="text-muted-foreground">No posts yet in this community.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                About Community
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{community.description}</p>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Users className="h-4 w-4 text-emerald-600" />
                                <span>{community.member_count} Members</span>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
