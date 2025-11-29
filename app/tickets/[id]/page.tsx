import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Briefcase, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { TicketDiscussion } from "@/components/tickets/ticket-discussion";
import { BidList } from "@/components/tickets/bid-list";
import { BidForm } from "@/components/tickets/bid-form";
import { RealtimeTicketListener } from "@/components/tickets/realtime-ticket-listener";

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch ticket details
    const { data: ticket } = await supabase
        .from("tickets")
        .select("*, profiles(*)")
        .eq("id", id)
        .single();

    if (!ticket) {
        notFound();
    }

    // Fetch bids
    const { data: bids } = await supabase
        .from("bids")
        .select("*, profiles(*)")
        .eq("ticket_id", id)
        .order("created_at", { ascending: false });

    // Check current user
    const { data: { user } } = await supabase.auth.getUser();

    let currentUserProfile = null;
    if (user) {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
        currentUserProfile = data;
    }

    const isOwner = user?.id === ticket.created_by;
    const userRole = currentUserProfile?.role;

    // Check if current user has already bid
    const userBid = bids?.find(b => b.bidder_id === user?.id);

    // Filter bids for display
    // Owner sees all. Freelancers see only their own.
    const visibleBids = isOwner ? bids : (userBid ? [userBid] : []);

    return (
        <div className="container py-12 max-w-5xl">
            <RealtimeTicketListener ticketId={id} />

            {/* Header Section */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div>
                        <Badge variant="outline" className="mb-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                            {ticket.category}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{ticket.title}</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-stone-100 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4" />
                        <span>Posted {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={ticket.profiles?.avatar_url} />
                        <AvatarFallback>{ticket.profiles?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-gray-900">{ticket.profiles?.full_name}</p>
                        <p className="text-xs text-muted-foreground">@{ticket.profiles?.username}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="details" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-stone-100 p-1 rounded-full">
                    <TabsTrigger value="details" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Details</TabsTrigger>
                    <TabsTrigger value="discussion" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Discussion</TabsTrigger>
                    <TabsTrigger value="offers" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Offers {isOwner && bids?.length ? `(${bids.length})` : ''}
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Details */}
                <TabsContent value="details" className="space-y-8 animate-fade-in">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-xl font-semibold">Description</h3>
                                    <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {ticket.description}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="glass-card border-emerald-100">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Budget</span>
                                        <span className="text-2xl font-bold text-emerald-700">${ticket.budget}</span>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-stone-100 rounded-lg">
                                                <Calendar className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Deadline</p>
                                                <p className="text-muted-foreground">{format(new Date(ticket.deadline), "MMM d, yyyy")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-stone-100 rounded-lg">
                                                <Briefcase className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Status</p>
                                                <Badge variant="secondary" className="uppercase text-xs tracking-wider">
                                                    {ticket.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Discussion */}
                <TabsContent value="discussion" className="animate-fade-in">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">Public Discussion</h3>
                                <p className="text-muted-foreground text-sm">
                                    Ask questions about the project requirements. Keep it professional.
                                </p>
                            </div>
                            <TicketDiscussion ticketId={id} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Offers */}
                <TabsContent value="offers" className="animate-fade-in">
                    <div className="space-y-8">
                        {isOwner ? (
                            // Owner View: See all bids
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">Received Proposals</h3>
                                    <Badge variant="secondary">{bids?.length || 0} Total</Badge>
                                </div>
                                <BidList bids={visibleBids || []} isOwner={true} ticketId={id} currentUserId={user?.id} />
                            </div>
                        ) : (
                            // Freelancer / Public View
                            <div className="space-y-8">
                                {userBid ? (
                                    <div className="space-y-4">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-800 flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="font-medium">You have already placed a bid on this ticket.</span>
                                        </div>
                                        <h3 className="text-lg font-semibold">Your Proposal</h3>
                                        <BidList bids={[userBid]} isOwner={false} ticketId={id} currentUserId={user?.id} />
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2">
                                            {userRole === 'freelancer' ? (
                                                <BidForm ticketId={id} />
                                            ) : (
                                                <Card className="bg-stone-50 border-dashed">
                                                    <CardContent className="p-8 text-center space-y-2">
                                                        <Briefcase className="h-8 w-8 mx-auto text-muted-foreground" />
                                                        <h3 className="font-semibold">Freelancers Only</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {user ? "You are registered as a Buyer. Switch accounts to bid." : "Sign in as a Freelancer to place a bid."}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <Card className="bg-stone-50 border-none">
                                                <CardContent className="p-6 space-y-4">
                                                    <h4 className="font-semibold">Tips for a Great Proposal</h4>
                                                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                                                        <li>Read the description carefully.</li>
                                                        <li>Be specific about your approach.</li>
                                                        <li>Share relevant portfolio links.</li>
                                                        <li>Keep your pricing competitive.</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
