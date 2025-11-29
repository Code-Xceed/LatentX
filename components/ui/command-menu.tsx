"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FileText, Briefcase, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CommandMenu() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<{
        tickets: any[];
        gigs: any[];
        users: any[];
    }>({ tickets: [], gigs: [], users: [] });
    const supabase = createClient();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const openHandler = () => setOpen(true);
        window.addEventListener("keydown", down);
        window.addEventListener("open-command-menu", openHandler);

        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("open-command-menu", openHandler);
        };
    }, []);

    React.useEffect(() => {
        if (!query) {
            setResults({ tickets: [], gigs: [], users: [] });
            return;
        }

        const search = async () => {
            setLoading(true);
            try {
                const [tickets, gigs, users] = await Promise.all([
                    supabase.from("tickets").select("id, title").ilike("title", `%${query}%`).limit(3),
                    supabase.from("gigs").select("id, title").ilike("title", `%${query}%`).limit(3),
                    supabase.from("profiles").select("username, full_name").ilike("full_name", `%${query}%`).limit(3),
                ]);

                setResults({
                    tickets: tickets.data || [],
                    gigs: gigs.data || [],
                    users: users.data || [],
                });
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query, supabase]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border-none max-w-2xl">
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Type a command or search..."
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <Command.Empty className="py-6 text-center text-sm">
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Searching...
                                </div>
                            ) : (
                                "No results found."
                            )}
                        </Command.Empty>

                        {results.gigs.length > 0 && (
                            <Command.Group heading="Gigs">
                                {results.gigs.map((gig) => (
                                    <Command.Item
                                        key={gig.id}
                                        onSelect={() => runCommand(() => router.push(`/marketplace/${gig.id}`))}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-emerald-100 aria-selected:text-emerald-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    >
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        <span>{gig.title}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {results.tickets.length > 0 && (
                            <Command.Group heading="Tickets">
                                {results.tickets.map((ticket) => (
                                    <Command.Item
                                        key={ticket.id}
                                        onSelect={() => runCommand(() => router.push(`/tickets/${ticket.id}`))}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-emerald-100 aria-selected:text-emerald-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>{ticket.title}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {results.users.length > 0 && (
                            <Command.Group heading="Users">
                                {results.users.map((user) => (
                                    <Command.Item
                                        key={user.username}
                                        onSelect={() => runCommand(() => router.push(`/profile/${user.username}`))} // Assuming profile route by username or id
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-emerald-100 aria-selected:text-emerald-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{user.full_name}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        <Command.Separator className="my-1 h-px bg-slate-200" />

                        <Command.Group heading="Navigation">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/workspace"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-emerald-100 aria-selected:text-emerald-900"
                            >
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/marketplace"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-emerald-100 aria-selected:text-emerald-900"
                            >
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span>Marketplace</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
