"use client";

import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Bid {
    id: string;
    amount: number;
    delivery_days: number;
    message: string;
    status: string;
    created_at: string;
    portfolio_links: string[];
    bidder_id: string;
    profiles: {
        full_name: string;
        avatar_url: string;
        username: string;
        role: string;
    };
}

export function BidList({ bids, isOwner, ticketId, currentUserId }: { bids: Bid[], isOwner: boolean, ticketId: string, currentUserId?: string }) {
    const supabase = createClient();
    const [localBids, setLocalBids] = useState(bids);

    useEffect(() => {
        setLocalBids(bids);
    }, [bids]);

    useEffect(() => {
        const channel = supabase
            .channel('realtime-bids')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'bids',
                filter: `ticket_id=eq.${ticketId}`
            }, async (payload) => {
                if (payload.eventType === 'INSERT') {
                    // Privacy Check: Only show new bid if Owner OR if it's my own bid
                    if (!isOwner && payload.new.bidder_id !== currentUserId) {
                        return;
                    }

                    const { data } = await supabase
                        .from("bids")
                        .select("*, profiles(*)")
                        .eq("id", payload.new.id)
                        .single();
                    if (data) {
                        setLocalBids(prev => [data, ...prev]);
                        toast.info("New bid received!");
                    }
                } else if (payload.eventType === 'UPDATE') {
                    // Privacy Check: Only update if Owner OR if it's my own bid
                    if (!isOwner && payload.new.bidder_id !== currentUserId) {
                        return;
                    }
                    setLocalBids(prev => prev.map(b => b.id === payload.new.id ? { ...b, ...payload.new } : b));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId, isOwner, currentUserId]);

    const handleStatusUpdate = async (bidId: string, newStatus: 'accepted' | 'rejected') => {
        const { error } = await supabase
            .from("bids")
            .update({ status: newStatus })
            .eq("id", bidId);

        if (error) {
            toast.error("Failed to update bid status");
        } else {
            // Optimistic update handled by realtime
        }
    };

    if (localBids.length === 0) {
        return (
            <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <p className="text-muted-foreground">No offers yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {localBids.map((bid) => (
                <Card key={bid.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-stone-200 group animate-in fade-in slide-in-from-bottom-4">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Bidder Info */}
                            <div className="flex items-start gap-4 min-w-[200px] md:border-r md:border-stone-100 md:pr-6">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                    <AvatarImage src={bid.profiles?.avatar_url} />
                                    <AvatarFallback className="bg-stone-100 text-stone-600 text-lg">
                                        {bid.profiles?.full_name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-gray-900">{bid.profiles?.full_name}</h4>
                                    <p className="text-sm text-emerald-600 font-medium">@{bid.profiles?.username}</p>
                                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground bg-stone-50 px-2 py-1 rounded-md w-fit">
                                        <Clock className="h-3 w-3" />
                                        {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>

                            {/* Bid Details */}
                            <div className="flex-1 space-y-5">
                                <div className="flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Bid Amount</span>
                                            <span className="text-2xl font-bold text-emerald-700">${bid.amount}</span>
                                        </div>
                                        <div className="h-8 w-px bg-stone-200 mx-2 hidden sm:block"></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Delivery</span>
                                            <span className="text-sm font-medium text-gray-700">{bid.delivery_days} Days</span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={bid.status === 'accepted' ? 'default' : bid.status === 'rejected' ? 'destructive' : 'secondary'}
                                        className={`px-3 py-1 text-xs font-semibold tracking-wide uppercase ${bid.status === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                            bid.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''
                                            }`}
                                    >
                                        {bid.status}
                                    </Badge>
                                </div>

                                <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {bid.message}
                                    </p>
                                </div>

                                {bid.portfolio_links && bid.portfolio_links.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                            Portfolio Items
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {bid.portfolio_links.map((link, i) => (
                                                <Button key={i} variant="outline" size="sm" asChild className="h-8 text-xs bg-white hover:bg-stone-50 hover:text-emerald-600 border-stone-200">
                                                    <Link href={link} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="mr-1.5 h-3 w-3" />
                                                        Portfolio Item {i + 1}
                                                    </Link>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions (Only for Owner) */}
                            {isOwner && bid.status === 'pending' && (
                                <div className="flex flex-col gap-3 justify-center md:border-l md:border-stone-100 md:pl-6 md:ml-2 min-w-[140px]">
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full shadow-sm"
                                        onClick={() => handleStatusUpdate(bid.id, 'accepted')}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full border-red-200"
                                        onClick={() => handleStatusUpdate(bid.id, 'rejected')}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
