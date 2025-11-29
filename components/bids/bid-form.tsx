"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface BidFormProps {
    ticketId: string;
}

export function BidForm({ ticketId }: BidFormProps) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const amount = parseFloat(formData.get("amount") as string);
        const delivery_days = parseInt(formData.get("delivery_days") as string);
        const message = formData.get("message") as string;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("bids")
                .insert({
                    ticket_id: ticketId,
                    bidder_id: user.id,
                    amount,
                    delivery_days,
                    message,
                });

            if (error) throw error;

            // Reset form
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Error placing bid:", error);
            alert("Failed to place bid");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Place a Bid</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Bid Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" min="0" step="0.01" required placeholder="500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delivery_days">Delivery Time (Days)</Label>
                            <Input id="delivery_days" name="delivery_days" type="number" min="1" required placeholder="7" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Proposal</Label>
                        <Textarea
                            id="message"
                            name="message"
                            required
                            placeholder="Explain why you are the best fit for this job..."
                            className="min-h-[100px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Placing Bid..." : "Place Bid"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
