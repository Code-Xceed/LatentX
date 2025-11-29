"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export function RealtimeTicketListener({ ticketId }: { ticketId: string }) {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel(`ticket-status-${ticketId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'tickets',
                filter: `id=eq.${ticketId}`
            }, (payload) => {
                // Refresh the page to show new status/details
                router.refresh();
                toast.info("Ticket updated!");
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId, router]);

    return null;
}
