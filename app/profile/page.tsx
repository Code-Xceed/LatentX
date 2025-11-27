import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Calendar, Edit, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

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

    return (
        <div className="container py-8 max-w-4xl">
            <Card className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                            <AvatarFallback className="text-3xl">{profile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/profile/edit">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                            <p className="text-muted-foreground">@{profile.username}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
                            </div>
                            {profile.website && (
                                <div className="flex items-center gap-1 hover:text-primary transition-colors">
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

                        <Separator />

                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">About</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {profile.bio || "No bio provided yet."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills && profile.skills.length > 0 ? (
                                            profile.skills.map((skill: string) => (
                                                <Badge key={skill} variant="outline">{skill}</Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No skills listed.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
