"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface Bid {
    id: string;
    amount: number;
    delivery_days: number;
    message: string;
    status: string;
    created_at: string;
    bidder: {
        id: string;
        full_name: string;
        username: string;
        avatar_url: string;
    };
}

interface BidListProps {
    ticketId: string;
    isOwner: boolean;
}

export function BidList({ ticketId, isOwner }: BidListProps) {
    const [bids, setBids] = useState<Bid[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchBids = async () => {
            const { data } = await supabase
                .from("bids")
                .select(`
                    *,
                    bidder:profiles(id, full_name, username, avatar_url)
                `)
                .eq("ticket_id", ticketId)
                .order("created_at", { ascending: false });

            if (data) setBids(data as any);
        };

        fetchBids();

        const channel = supabase
            .channel("realtime-bids")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bids",
                    filter: `ticket_id=eq.${ticketId}`,
                },
                () => {
                    fetchBids();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId, supabase]);

    const handleAcceptBid = async (bidId: string) => {
        try {
            const { error } = await supabase
                .from("bids")
                .update({ status: "accepted" })
                .eq("id", bidId);

            if (error) throw error;

            // Also update ticket status
            await supabase
                .from("tickets")
                .update({ status: "in_progress" })
                .eq("id", ticketId);

        } catch (error) {
            console.error("Error accepting bid:", error);
            alert("Failed to accept bid");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Bids ({bids.length})</h3>
            {bids.length === 0 ? (
                <p className="text-muted-foreground">No bids yet. Be the first to bid!</p>
            ) : (
                bids.map((bid) => (
                    <Card key={bid.id}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar>
                                <AvatarImage src={bid.bidder.avatar_url} />
                                <AvatarFallback>{bid.bidder.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-base">{bid.bidder.full_name || bid.bidder.username}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(bid.created_at))} ago
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">${bid.amount}</div>
                                <div className="text-xs text-muted-foreground">in {bid.delivery_days} days</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-4">{bid.message}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant={bid.status === 'accepted' ? 'default' : 'secondary'}>
                                    {bid.status}
                                </Badge>
                                {isOwner && bid.status === 'pending' && (
                                    <Button size="sm" onClick={() => handleAcceptBid(bid.id)}>
                                        Accept Offer
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
