import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Ticket {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
    category: string;
    status: string;
    created_at: string;
}

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl line-clamp-2">{ticket.title}</CardTitle>
                    <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                        {ticket.status}
                    </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                    {ticket.category}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3 mb-4">
                    {ticket.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${ticket.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ticket.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Posted {formatDistanceToNow(new Date(ticket.created_at))} ago</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/tickets/${ticket.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
