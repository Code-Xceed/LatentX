"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    author_id: string;
    profiles: {
        full_name: string;
        avatar_url: string;
        username: string;
    };
}

export function TicketDiscussion({ ticketId }: { ticketId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchComments();

        const channel = supabase
            .channel('ticket_comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ticket_comments',
                filter: `ticket_id=eq.${ticketId}`
            }, (payload) => {
                // Real-time update: fetch the new comment with profile data
                fetchNewComment(payload.new.id);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("ticket_comments")
            .select("*, profiles(*)")
            .eq("ticket_id", ticketId)
            .order("created_at", { ascending: true });

        if (error) console.error("Error fetching comments:", error);
        else setComments(data || []);
    };

    const fetchNewComment = async (commentId: string) => {
        const { data, error } = await supabase
            .from("ticket_comments")
            .select("*, profiles(*)")
            .eq("id", commentId)
            .single();

        if (data) {
            setComments(prev => {
                // Avoid duplicates
                if (prev.some(c => c.id === data.id)) return prev;
                return [...prev, data];
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("You must be logged in to comment.");
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from("ticket_comments")
            .insert({
                content: newComment,
                ticket_id: ticketId,
                author_id: user.id
            });

        if (error) {
            toast.error("Failed to post comment.");
            console.error(error);
        } else {
            setNewComment("");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                            <Send className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="font-medium">No discussion yet</p>
                        <p className="text-sm">Be the first to ask a question!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                                <AvatarImage src={comment.profiles?.avatar_url} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
                                    {comment.profiles?.full_name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-gray-900">{comment.profiles?.full_name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="bg-stone-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm border border-stone-100 leading-relaxed max-w-[90%]">
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4 items-start pt-4 border-t border-border">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or discuss details..."
                    className="min-h-[80px] bg-white"
                />
                <Button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-10 w-10 p-0 flex items-center justify-center shrink-0"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
