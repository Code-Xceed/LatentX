import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="bg-stone-100 p-6 rounded-full mb-6">
                <FileQuestion className="h-16 w-16 text-stone-400" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
            </p>
            <div className="flex gap-4">
                <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href="/">Go Home</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
        </div>
    );
}
