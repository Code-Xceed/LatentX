"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Image as ImageIcon } from "lucide-react";

const CATEGORIES = [
    "Web Development",
    "Mobile Development",
    "Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "AI Services"
];

export function GigForm() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        delivery_time: "",
        category: "",
        image_url: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("gigs")
                .insert({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    delivery_time: parseInt(formData.delivery_time),
                    category: formData.category,
                    freelancer_id: user.id,
                    images: formData.image_url ? [formData.image_url] : [],
                });

            if (error) throw error;

            router.push("/marketplace");
            router.refresh();
        } catch (error) {
            console.error("Error creating gig:", error);
            alert("Failed to create gig. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto glass-card">
            <CardHeader>
                <CardTitle className="text-2xl font-serif">Create a New Gig</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Gig Title</Label>
                        <Input
                            id="title"
                            placeholder="I will build a modern website for you..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your service in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="min-h-[150px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="5"
                                placeholder="50"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delivery_time">Delivery Time (Days)</Label>
                            <Input
                                id="delivery_time"
                                type="number"
                                min="1"
                                placeholder="3"
                                value={formData.delivery_time}
                                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Cover Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="image"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                            <Button type="button" variant="outline" size="icon">
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Provide a direct link to an image to showcase your service.
                        </p>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Gig...
                            </>
                        ) : (
                            "Publish Gig"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
