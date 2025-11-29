"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => setSubmitted(true), 1000);
    };

    return (
        <div className="container py-12 md:py-24 max-w-5xl">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-serif font-bold">Get in Touch</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Have a question or need support? We're here to help. Send us a message and we'll get back to you as soon as possible.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                    <Card className="glass-card border-none shadow-md">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Email Us</h3>
                                <p className="text-sm text-muted-foreground">support@latentx.com</p>
                                <p className="text-sm text-muted-foreground">partners@latentx.com</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-none shadow-md">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Call Us</h3>
                                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                                <p className="text-sm text-muted-foreground">Mon-Fri, 9am - 6pm EST</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-none shadow-md">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Visit Us</h3>
                                <p className="text-sm text-muted-foreground">123 Innovation Drive</p>
                                <p className="text-sm text-muted-foreground">Tech City, TC 90210</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submitted ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                        <Mail className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-emerald-700">Message Sent!</h3>
                                    <p className="text-muted-foreground">
                                        Thank you for reaching out. We'll be in touch shortly.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" placeholder="John Doe" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="How can we help?" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us more about your inquiry..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                                        Send Message
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
