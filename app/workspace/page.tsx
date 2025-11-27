import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, DollarSign, MessageSquare, Star, Clock, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function WorkspacePage() {
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

    if (!profile?.role) {
        redirect("/onboarding");
    }

    const isFreelancer = profile.role === "freelancer";

    return (
        <div className="container py-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                        <AvatarFallback className="text-xl">{profile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile.full_name?.split(" ")[0]}!</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <span>@{profile.username}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <Badge variant="secondary" className="capitalize">{profile.role}</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                    {isFreelancer ? (
                        <Button asChild>
                            <Link href="/marketplace">
                                <Search className="mr-2 h-4 w-4" /> Find Work
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/tickets/new">
                                <Plus className="mr-2 h-4 w-4" /> Post a Job
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <Separator />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {isFreelancer ? "Total Earnings" : "Total Spent"}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">
                            +0% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Jobs
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            0 in progress
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Unread Messages
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            All caught up!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.0</div>
                        <p className="text-xs text-muted-foreground">
                            Based on 0 reviews
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity / Jobs */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest actions and updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            <Clock className="h-12 w-12 mb-4 opacity-20" />
                            <p>No recent activity to show.</p>
                            <Button variant="link" asChild className="mt-2">
                                <Link href={isFreelancer ? "/marketplace" : "/tickets/new"}>
                                    {isFreelancer ? "Browse Marketplace" : "Create a Ticket"}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar / Recommendations */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{isFreelancer ? "Recommended Jobs" : "Top Freelancers"}</CardTitle>
                        <CardDescription>
                            {isFreelancer ? "Jobs matching your skills." : "Talent you might like."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            <Search className="h-12 w-12 mb-4 opacity-20" />
                            <p>We are still learning your preferences.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
