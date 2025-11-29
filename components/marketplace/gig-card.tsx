import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";

import Image from "next/image";

interface GigCardProps {
    gig: any;
}

export function GigCard({ gig }: GigCardProps) {
    return (
        <Link href={`/marketplace/${gig.id}`}>
            <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 bg-muted overflow-hidden">
                    {gig.images && gig.images.length > 0 ? (
                        <Image
                            src={gig.images[0]}
                            alt={gig.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-stone-100 flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-white/90 text-emerald-700 hover:bg-white backdrop-blur-sm shadow-sm">
                        {gig.category}
                    </Badge>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col gap-3">
                    {/* Freelancer Info */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                            <AvatarImage src={gig.profiles?.avatar_url} />
                            <AvatarFallback>{gig.profiles?.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-muted-foreground truncate">
                            {gig.profiles?.full_name}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {gig.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-sm text-amber-500 mt-auto">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{gig.rating || "New"}</span>
                        <span className="text-muted-foreground">({gig.review_count || 0})</span>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border/50 mt-auto">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {gig.delivery_time} days
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">Starting at</span>
                        <span className="font-bold text-lg text-emerald-700">${gig.price}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
