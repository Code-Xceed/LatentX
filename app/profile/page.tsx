import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Calendar, Edit, Briefcase, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { GigCard } from "@/components/marketplace/gig-card";
import { PostCard } from "@/components/community/post-card";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/onboarding");
    }

    // Fetch User's Gigs
    const { data: gigs } = await supabase
        .from("gigs")
        .select("*, profiles(*)")
        .eq("freelancer_id", user.id);

    // Fetch User's Tickets
    const { data: tickets } = await supabase
        .from("tickets")
        .select("*")
        .eq("created_by", user.id);

    // Fetch User's Posts
    const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(*), communities(*)")
        .eq("author_id", user.id);

    return (
        <div className="container py-8 max-w-5xl">
            <Card className="overflow-hidden mb-8 border-none shadow-lg">
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                            <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-700">{profile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                            <Link href="/profile/edit">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-serif font-bold">{profile.full_name}</h1>
                            <p className="text-muted-foreground">@{profile.username}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="capitalize bg-emerald-50 text-emerald-700 hover:bg-emerald-100">{profile.role}</Badge>
                            </div>
                            {profile.website && (
                                <div className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                                    <Globe className="h-4 w-4" />
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {profile.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                            {profile.bio || "No bio provided yet."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {profile.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill: string) => (
                                    <Badge key={skill} variant="outline" className="border-emerald-200 text-emerald-700">{skill}</Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No skills listed.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <Tabs defaultValue="activity" className="space-y-6">
                <TabsList className="bg-white/50 p-1 rounded-full border border-gray-200">
                    <TabsTrigger value="activity" className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Activity</TabsTrigger>
                    {profile.role === "freelancer" && (
                        <TabsTrigger value="gigs" className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Gigs</TabsTrigger>
                    )}
                    <TabsTrigger value="tickets" className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Tickets</TabsTrigger>
                    <TabsTrigger value="community" className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Community</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-emerald-600" /> Recent Community Posts
                    </h3>
                    {posts && posts.length > 0 ? (
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} currentUserId={user.id} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No recent activity.</p>
                    )}
                </TabsContent>

                <TabsContent value="gigs" className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-emerald-600" /> Active Gigs
                    </h3>
                    {gigs && gigs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gigs.map((gig) => (
                                <GigCard key={gig.id} gig={gig} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No active gigs.</p>
                    )}
                </TabsContent>

                <TabsContent value="tickets" className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-600" /> Posted Tickets
                    </h3>
                    {tickets && tickets.length > 0 ? (
                        <div className="grid gap-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">{ticket.title}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                                            </div>
                                            <Badge>{ticket.status}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No tickets posted.</p>
                    )}
                </TabsContent>

                <TabsContent value="community" className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-emerald-600" /> Community Contributions
                    </h3>
                    {posts && posts.length > 0 ? (
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} currentUserId={user.id} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No community posts yet.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
