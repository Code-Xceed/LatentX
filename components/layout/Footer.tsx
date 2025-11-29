import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf w-4 h-4 text-white">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                                </svg>
                            </div>
                            <span className="text-lg font-serif font-medium tracking-tight text-gray-900">LatentX</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Connecting visionary clients with world-class talent. The future of work is here.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/marketplace" className="hover:text-emerald-600 transition-colors">Browse Gigs</Link></li>
                            <li><Link href="/tickets" className="hover:text-emerald-600 transition-colors">Find Work</Link></li>
                            <li><Link href="/community" className="hover:text-emerald-600 transition-colors">Community</Link></li>
                            <li><Link href="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Stay Updated</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe to our newsletter for the latest updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-50 border-none rounded-full px-4 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-100 outline-none"
                            />
                            <button className="bg-emerald-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © 2024 LatentX Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
