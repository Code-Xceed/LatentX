"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = [
    "Web Development",
    "Mobile Development",
    "Design",
    "Writing",
    "Marketing",
    "Data Science",
    "Other"
];

export function TicketForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const budget = parseFloat(formData.get("budget") as string);
        const deadline = formData.get("deadline") as string;
        const category = formData.get("category") as string;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("tickets")
                .insert({
                    title,
                    description,
                    budget,
                    deadline: new Date(deadline).toISOString(),
                    category,
                    created_by: user.id,
                });

            if (error) throw error;

            router.push("/tickets");
            router.refresh();
        } catch (error) {
            console.error("Error creating ticket:", error);
            alert("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Post a New Ticket</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required placeholder="e.g. Build a React Dashboard" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget ($)</Label>
                            <Input id="budget" name="budget" type="number" min="0" step="0.01" required placeholder="500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" name="deadline" type="date" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Describe your project requirements in detail..."
                            className="min-h-[150px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Posting..." : "Post Ticket"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
