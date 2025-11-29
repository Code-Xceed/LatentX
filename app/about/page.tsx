import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-24 space-y-16">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-gray-900">
                    Empowering the Future of <span className="text-emerald-600">Work</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    LatentX is a next-generation freelancing platform designed to connect world-class talent with visionary clients. We believe in a fair, transparent, and efficient marketplace for everyone.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-emerald-50 border-none shadow-sm">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Community First</h3>
                        <p className="text-muted-foreground">
                            We prioritize building a supportive community where freelancers can grow, learn, and collaborate.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-none shadow-sm">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Trust & Safety</h3>
                        <p className="text-muted-foreground">
                            Your security is our top priority. We use advanced verification and secure payment systems to protect every transaction.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-none shadow-sm">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Global Reach</h3>
                        <p className="text-muted-foreground">
                            Talent knows no borders. We connect you with opportunities and experts from around the world.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Story Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold">Our Story</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Founded in 2024, LatentX emerged from a simple idea: freelancing shouldn't be complicated. We saw the struggles of traditional platforms—high fees, poor communication, and lack of community—and decided to build something better.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Today, we are a growing ecosystem of creators, developers, and entrepreneurs. We are not just a marketplace; we are a movement towards a more flexible and empowering way of working.
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span>Zero hidden fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span>Verified professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span>24/7 dedicated support</span>
                        </div>
                    </div>
                </div>
                <div className="relative h-[400px] rounded-3xl overflow-hidden bg-stone-100">
                    {/* Placeholder for an image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-lg">Team Image Placeholder</span>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6 py-12 bg-stone-900 text-white rounded-3xl">
                <h2 className="text-3xl font-serif font-bold">Join the Revolution</h2>
                <p className="text-stone-300 max-w-2xl mx-auto">
                    Whether you're looking to hire top talent or find your next big project, LatentX is the place for you.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full text-stone-900 border-white hover:bg-stone-100">
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
