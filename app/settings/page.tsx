import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="container py-10 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
            <Separator className="mb-8" />

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Manage your account preferences and security settings here.</p>
                        {/* Add settings forms here */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Configure how you receive notifications.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
