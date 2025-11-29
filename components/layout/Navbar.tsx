"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Bell, Search, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_LINKS = [
    { href: "/tickets", label: "Find Work" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/community", label: "Community" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <header className="fixed top-0 z-50 w-full glass-effect">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf w-5 h-5 text-white">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                            </svg>
                        </div>
                        <span className="text-xl font-serif font-medium tracking-tight text-gray-900">LatentX</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-emerald-600",
                                    pathname === link.href
                                        ? "text-emerald-700"
                                        : "text-gray-600"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div
                        className="relative w-64 cursor-pointer"
                        onClick={() => window.dispatchEvent(new CustomEvent("open-command-menu"))}
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search... (Ctrl+K)"
                            className="w-full bg-white/50 pl-10 border-transparent focus-visible:bg-white focus-visible:border-emerald-200 focus-visible:ring-emerald-200/50 transition-all rounded-full h-10 pointer-events-none"
                            readOnly
                        />
                    </div>

                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-emerald-50 hover:text-emerald-600">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <div className="h-6 w-px bg-gray-200" />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/workspace" className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild className="font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-full px-6">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild className="rounded-full px-6 shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                                <Link href="/signup">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-emerald-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl p-4 space-y-4 absolute w-full shadow-2xl animate-in slide-in-from-top-5">
                    <nav className="flex flex-col gap-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors",
                                    pathname === link.href
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-gray-600"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        {user ? (
                            <>
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/workspace">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" className="w-full justify-center rounded-full border-gray-200" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button className="w-full justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                    <Link href="/signup">Sign up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
