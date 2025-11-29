"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Leaf, ShieldCheck, MessageCircle, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50/50">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center mb-20">
            <div className="max-w-2xl space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                The Future of Freelancing
              </div>

              <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-gray-900 leading-[1.1]">
                Work Without <br />
                <span className="font-light italic text-emerald-700">Boundaries</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                LatentX merges the best of marketplaces and communities.
                Connect with top talent, manage projects in real-time, and build your empire.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-lg shadow-emerald-600/20" asChild>
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-gray-200 hover:bg-white hover:text-emerald-700" asChild>
                  <Link href="/tickets">
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Stats / Social Proof */}
            <div className="lg:ml-auto flex flex-col gap-6 animate-slide-left" style={{ animationDelay: "0.2s" }}>
              <div className="glass-card p-6 rounded-3xl flex items-center gap-4 max-w-xs">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Trusted by 2k+ pros</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">

            {/* Feature 1: Large Card */}
            <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl shadow-xl animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-900" />
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')] bg-cover bg-center mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />

              <div className="relative h-full p-8 flex flex-col justify-between text-white">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif mb-4">Organic Growth</h3>
                  <p className="text-emerald-100 leading-relaxed max-w-md">
                    Our platform is designed to help you grow naturally. No pay-to-win algorithms, just pure talent and connection.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Tall Card */}
            <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Verified Talent</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every freelancer is vetted. Quality you can trust, every single time.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                  100% Secure
                </div>
              </div>
            </div>

            {/* Feature 3: Wide Card */}
            <div className="md:col-span-3 lg:col-span-1 row-span-2 bg-gradient-to-br from-stone-100 to-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Real-time Chat</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Collaborate seamlessly with built-in messaging and project tools.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-4xl font-serif font-medium text-gray-900">
              Ready to Start Your <span className="italic text-emerald-600">Journey?</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of professionals who have found their home on LatentX.
            </p>
            <Button size="lg" className="rounded-full px-10 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20">
              <Link href="/signup">Join Now - It's Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
