"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, MessageSquare, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

interface PostCardProps {
    post: any;
    currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const [votes, setVotes] = useState(post.upvotes || 0);
    const [hasVoted, setHasVoted] = useState(false); // Simplified for now
    const supabase = createClient();

    const handleVote = async () => {
        if (!currentUserId) return; // Prompt login

        // Optimistic update
        const newVotes = hasVoted ? votes - 1 : votes + 1;
        setVotes(newVotes);
        setHasVoted(!hasVoted);

        // Actual DB update (simplified, ideally use an RPC or separate votes table logic)
        // For this MVP, we'll just update the local state and assume the backend handles it via API or RPC
        // But since we are client side, we should call an action or API.
        // Let's just update the posts table directly for now if RLS allows, or use a separate votes table.
        // The schema has a 'votes' table. We should insert/delete from there.

        try {
            if (hasVoted) {
                // Remove vote
                await supabase
                    .from("votes")
                    .delete()
                    .match({ user_id: currentUserId, post_id: post.id });

                // Decrement post count
                await supabase.rpc('decrement_upvotes', { row_id: post.id });
            } else {
                // Add vote
                await supabase
                    .from("votes")
                    .insert({ user_id: currentUserId, post_id: post.id, value: 1 });

                // Increment post count
                await supabase.rpc('increment_upvotes', { row_id: post.id });
            }
        } catch (error) {
            console.error("Error voting:", error);
            // Revert
            setVotes(votes);
            setHasVoted(hasVoted);
        }
    };

    return (
        <Card className="hover:border-emerald-200 transition-colors">
            <div className="flex">
                {/* Vote Column */}
                <div className="flex flex-col items-center p-3 bg-stone-50/50 border-r border-border/50 w-12 gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 hover:bg-emerald-100 hover:text-emerald-600", hasVoted && "text-emerald-600")}
                        onClick={handleVote}
                    >
                        <ArrowBigUp className={cn("h-6 w-6", hasVoted && "fill-current")} />
                    </Button>
                    <span className="text-sm font-bold text-muted-foreground">{votes}</span>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Link href={`/community/${post.communities?.slug}`} className="font-bold text-foreground hover:underline">
                                c/{post.communities?.name}
                            </Link>
                            <span>•</span>
                            <span>Posted by u/{post.profiles?.username}</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <Link href={`/community/${post.communities?.slug}/post/${post.id}`}>
                            <h3 className="text-lg font-semibold hover:text-emerald-700 transition-colors leading-tight">
                                {post.title}
                            </h3>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                            {post.content}
                        </p>
                    </CardContent>
                    <CardFooter className="p-2 pl-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-stone-100 h-8">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {post.comment_count || 0} Comments
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-stone-100 h-8">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}
