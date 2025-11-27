"use client";

import { verifyOtp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function VerifyForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await verifyOtp(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Verify Email</CardTitle>
                <CardDescription>
                    Enter the code sent to {email}
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={email} readOnly className="bg-muted" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="token">Verification Code</Label>
                        <Input id="token" name="token" type="text" placeholder="123456" required />
                    </div>
                    {error && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-red-500">{error}</p>
                            <Button variant="outline" size="sm" type="button" onClick={() => setError(null)}>
                                Retry
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyForm />
            </Suspense>
        </div>
    );
}
