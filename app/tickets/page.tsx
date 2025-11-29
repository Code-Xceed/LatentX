"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { TicketCard } from "@/components/tickets/ticket-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
    "All Categories",
    "Web Development",
    "Mobile Development",
    "Design",
    "Writing",
    "Marketing",
    "Data Science",
    "Other"
];

export default function TicketBoard() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const supabase = createClient();

    useEffect(() => {
        const fetchTickets = async () => {
            let query = supabase
                .from("tickets")
                .select("*")
                .eq("status", "open")
                .order("created_at", { ascending: false });

            if (category !== "All Categories") {
                query = query.eq("category", category);
            }

            if (search) {
                query = query.ilike("title", `%${search}%`);
            }

            const { data } = await query;
            if (data) setTickets(data);
        };

        fetchTickets();

        const channel = supabase
            .channel("realtime-tickets")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "tickets",
                },
                () => {
                    fetchTickets();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [category, search, supabase]);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Ticket Board</h1>
                    <p className="text-muted-foreground">Find work or post a job</p>
                </div>
                <Button asChild>
                    <Link href="/tickets/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Post a Ticket
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:w-1/3"
                />
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No tickets found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
