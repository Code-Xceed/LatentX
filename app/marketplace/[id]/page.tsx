import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Star, CheckCircle2, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";

export default async function GigDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: gig } = await supabase
        .from("gigs")
        .select("*, profiles(*)")
        .eq("id", id)
        .single();

    if (!gig) {
        notFound();
    }

    return (
        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">{gig.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarImage src={gig.profiles?.avatar_url} />
                                    <AvatarFallback>{gig.profiles?.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{gig.profiles?.full_name}</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center gap-1 text-emerald-600">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-medium">5.0</span>
                                <span className="text-muted-foreground">(New Seller)</span>
                            </div>
                        </div>

                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-stone-100 mb-8">
                            {/* Placeholder for Gig Image - In real app, use next/image with gig.image_url */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <span className="text-lg">Gig Image Placeholder</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium">About This Gig</h2>
                            <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {gig.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="sticky top-24 glass-card border-emerald-100 shadow-xl">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-muted-foreground font-medium">Price</span>
                                <span className="text-3xl font-bold text-emerald-700">${gig.price}</span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                A complete package tailored to your needs.
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">{gig.delivery_time} Days Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">Unlimited Revisions</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Button className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" size="lg">
                                    Continue (${gig.price})
                                </Button>
                                <Button variant="outline" className="w-full rounded-full" asChild>
                                    <Link href={`/messages?user=${gig.freelancer_id}`}>
                                        <MessageSquare className="mr-2 h-4 w-4" /> Contact Freelancer
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="h-20 w-20 border-4 border-stone-50">
                                    <AvatarImage src={gig.profiles?.avatar_url} />
                                    <AvatarFallback className="text-2xl">{gig.profiles?.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{gig.profiles?.full_name}</h3>
                                    <p className="text-sm text-muted-foreground">@{gig.profiles?.username}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full">
                                    View Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
