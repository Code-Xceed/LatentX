import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/community/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function CommunityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch communities
    const { data: communities } = await supabase
        .from("communities")
        .select("*")
        .order("member_count", { ascending: false })
        .limit(5);

    // Fetch trending posts
    const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(*), communities(*)")
        .order("upvotes", { ascending: false })
        .limit(10);

    return (
        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-serif font-medium">Community Feed</h1>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-full">
                                <TrendingUp className="mr-2 h-4 w-4" /> Trending
                            </Button>
                            <Button variant="ghost" className="rounded-full text-muted-foreground">
                                Newest
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.id} post={post} currentUserId={user?.id} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="glass-card border-emerald-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <Users className="h-5 w-5 text-emerald-600" />
                                Top Communities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {communities && communities.length > 0 ? (
                                communities.map((community) => (
                                    <Link
                                        key={community.id}
                                        href={`/community/${community.slug}`}
                                        className="flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700">
                                                <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium group-hover:text-emerald-700 transition-colors">
                                                c/{community.name}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No communities yet.</p>
                            )}
                            <Separator />
                            <Button className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                <Link href="/community/create">
                                    <Plus className="mr-2 h-4 w-4" /> Create Community
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>1. Be respectful and kind.</p>
                            <p>2. No spam or self-promotion.</p>
                            <p>3. Stay on topic.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
