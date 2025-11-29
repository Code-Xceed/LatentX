"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BidForm({ ticketId }: { ticketId: string }) {
    const [amount, setAmount] = useState("");
    const [days, setDays] = useState("");
    const [message, setMessage] = useState("");
    const [links, setLinks] = useState<string[]>([]);
    const [currentLink, setCurrentLink] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const addLink = () => {
        if (currentLink && !links.includes(currentLink)) {
            setLinks([...links, currentLink]);
            setCurrentLink("");
        }
    };

    const removeLink = (linkToRemove: string) => {
        setLinks(links.filter(link => link !== linkToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("You must be logged in to place a bid.");
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from("bids")
            .insert({
                ticket_id: ticketId,
                bidder_id: user.id,
                amount: parseFloat(amount),
                delivery_days: parseInt(days),
                message,
                portfolio_links: links,
                status: 'pending'
            });

        if (error) {
            toast.error("Failed to place bid. Please try again.");
            console.error(error);
        } else {
            toast.success("Bid placed successfully!");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <Card className="border-emerald-100 shadow-lg">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                <CardTitle className="text-emerald-800">Submit a Proposal</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Bid Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="days">Delivery Time (Days)</Label>
                            <Input
                                id="days"
                                type="number"
                                placeholder="1"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Cover Letter</Label>
                        <Textarea
                            id="message"
                            placeholder="Explain why you are the best fit for this job..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="min-h-[120px] bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Portfolio Links (Optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://dribbble.com/shot/..."
                                value={currentLink}
                                onChange={(e) => setCurrentLink(e.target.value)}
                                className="bg-white"
                            />
                            <Button type="button" onClick={addLink} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {links.map((link) => (
                                    <div key={link} className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-xs">
                                        <span className="truncate max-w-[200px]">{link}</span>
                                        <button type="button" onClick={() => removeLink(link)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/20"
                    >
                        {loading ? "Submitting..." : (
                            <>
                                <Send className="mr-2 h-4 w-4" /> Place Bid
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
