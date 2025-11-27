"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { User, Briefcase, ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({
        role: "" as "buyer" | "freelancer" | "",
        username: "",
        full_name: "",
        website: "",
        bio: "",
        skills: "",
    });
    const router = useRouter();
    const supabase = createClient();

    // Check if user already has a completed profile
    useEffect(() => {
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile?.role && profile?.username) {
                router.push("/workspace");
            } else if (profile) {
                // Pre-fill existing data
                setFormData(prev => ({
                    ...prev,
                    full_name: profile.full_name || "",
                    username: profile.username || "",
                    website: profile.website || "",
                    bio: profile.bio || "",
                    skills: profile.skills ? profile.skills.join(", ") : "",
                    role: profile.role || "",
                }));
            }
        };
        checkProfile();
    }, [router, supabase]);

    const handleRoleSelect = (role: "buyer" | "freelancer") => {
        setFormData(prev => ({ ...prev, role }));
        setStep(2);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(s => s.length > 0);

            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    role: formData.role,
                    username: formData.username,
                    full_name: formData.full_name,
                    website: formData.website,
                    bio: formData.bio,
                    skills: skillsArray,
                    updated_at: new Date().toISOString(),
                })
                .select();

            if (error) throw error;

            router.push("/workspace");
        } catch (error) {
            console.error("Error updating profile:", JSON.stringify(error, null, 2));
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 1) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Welcome to LatentX</CardTitle>
                        <CardDescription className="text-lg">
                            How do you plan to use LatentX?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <Button
                            variant="outline"
                            className="flex h-auto flex-col gap-4 p-8 hover:border-primary hover:bg-accent"
                            onClick={() => handleRoleSelect("freelancer")}
                        >
                            <Briefcase className="h-12 w-12" />
                            <div className="space-y-2">
                                <h3 className="font-bold">I want to work</h3>
                                <p className="text-sm text-muted-foreground">
                                    Find jobs, manage tasks, and get paid.
                                </p>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex h-auto flex-col gap-4 p-8 hover:border-primary hover:bg-accent"
                            onClick={() => handleRoleSelect("buyer")}
                        >
                            <User className="h-12 w-12" />
                            <div className="space-y-2">
                                <h3 className="font-bold">I want to hire</h3>
                                <p className="text-sm text-muted-foreground">
                                    Post jobs, find talent, and manage projects.
                                </p>
                            </div>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="-ml-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                    </div>
                    <CardDescription>
                        Tell us a bit more about yourself.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="johndoe"
                                required
                                minLength={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about your skills and experience..."
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="skills">Skills (comma separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleInputChange}
                                placeholder="React, Design, Writing..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website (Optional)</Label>
                            <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                                type="url"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Complete Setup"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
