"use client";

import { X, Send, Loader2, MessageCircle, Heart, Clock } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateAvatarUrl,
  generateAnonymousName,
  getRandomSeed,
} from "@/lib/anonymousUtils";
import { graphqlRequest } from "@/lib/graphql";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  gender: string;
  anonymousName: string;
  avatarSeed: number;
  createdAt: string;
}

interface Confession {
  id: string;
  content: string;
  category: string | null;
  likes: number;
  gender: string;
  anonymousName: string;
  avatarSeed: number;
  createdAt: string;
  comments: Comment[];
}

interface CommentsModalProps {
  confession: Confession;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: (confessionId: string, comment: Comment) => void;
  onLikeUpdate?: (confessionId: string, newLikes: number) => void;
}

export default function CommentsModal({
  confession,
  isOpen,
  onClose,
  onCommentAdded,
  onLikeUpdate,
}: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [commentGender, setCommentGender] = useState("male");
  const [likes, setLikes] = useState(confession.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const mutation = `
        mutation LikeConfession($confessionId: String!) {
          likeConfession(confessionId: $confessionId)
        }
      `;
      const data = await graphqlRequest(mutation, {
        confessionId: confession.id,
      });
      return { likes: data.likeConfession };
    },
    onSuccess: (data) => {
      setLikes(data.likes);
      setIsLiking(false);
      if (onLikeUpdate) {
        onLikeUpdate(confession.id, data.likes);
      }
      queryClient.invalidateQueries({ queryKey: ["confessions"] });
    },
    onError: () => {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      setIsLiking(false);
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: { content: string; gender: string }) => {
      const avatarSeed = getRandomSeed();
      const anonymousName = generateAnonymousName(avatarSeed);

      const mutation = `
        mutation CreateComment(
          $confessionId: String!,
          $content: String!,
          $gender: String!,
          $anonymousName: String!,
          $avatarSeed: Int!
        ) {
          createComment(
            confessionId: $confessionId,
            content: $content,
            gender: $gender,
            anonymousName: $anonymousName,
            avatarSeed: $avatarSeed
          ) {
            id
            content
            gender
            anonymousName
            avatarSeed
            createdAt
          }
        }
      `;

      const result = await graphqlRequest(mutation, {
        confessionId: confession.id,
        content: data.content,
        gender: data.gender,
        anonymousName,
        avatarSeed,
      });

      return result.createComment as Comment;
    },
    onSuccess: (newComment) => {
      setCommentText("");
      setCommentGender("male");

      if (onCommentAdded && typeof onCommentAdded === "function") {
        try {
          onCommentAdded(confession.id, newComment);
        } catch (error) {
          console.error("Error in onCommentAdded callback:", error);
          alert(
            "An error occurred while adding your comment. Please try again."
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ["confessions"] });
    },
  });

  const handleLike = () => {
    if (!hasLiked && !isLiking) {
      setIsLiking(true);
      setHasLiked(true);
      setLikes((prev) => prev + 1);
      likeMutation.mutate();
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate({
        content: commentText.trim(),
        gender: commentGender,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getCategoryEmoji = (category: string | null) => {
    switch (category) {
      case "Love":
        return "💕";
      case "Career":
        return "💼";
      case "Family":
        return "👨‍👩‍👧";
      case "Friendship":
        return "🤝";
      case "Secret":
        return "🤫";
      default:
        return "💭";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-black via-black/98 to-purple-950/20 backdrop-blur-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header - Fixed */}
          <DialogHeader className="px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-black/80 via-purple-950/30 to-black/80 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Confession Thread
                </span>
              </DialogTitle>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/60 scrollbar-track-transparent">
            {/* Original Confession */}
            <div className="p-6 border-b border-purple-500/10 bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="flex gap-4">
                <div className="relative h-18">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-75 blur-md"></div>
                  <Image
                    height={50}
                    width={50}
                    src={generateAvatarUrl(
                      confession.gender,
                      confession.avatarSeed
                    )}
                    alt={confession.anonymousName}
                    className="relative w-14 h-14 rounded-full border-2 border-purple-400/50 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-black shadow-lg flex items-center justify-center">
                    <span className="text-[10px]">✨</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-base font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      {confession.anonymousName}
                    </p>
                    <span className="text-sm">
                      {confession.gender === "male" ? "👨" : "👩"}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDate(confession.createdAt)}
                    </span>
                    {confession.category && (
                      <>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="px-2.5 py-1 bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-xs font-bold text-purple-200 flex items-center gap-1.5 shadow-lg">
                          <span>{getCategoryEmoji(confession.category)}</span>
                          {confession.category}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-base text-white leading-relaxed mb-5 font-medium">
                    {confession.content}
                  </p>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      disabled={hasLiked}
                      className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg ${
                        hasLiked
                          ? "bg-gradient-to-r from-pink-500/40 to-rose-500/40 text-pink-300 border-2 border-pink-400/60 shadow-pink-500/30"
                          : "bg-black/40 text-gray-400 border-2 border-white/10 hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-rose-500/30 hover:text-pink-300 hover:border-pink-400/50 hover:shadow-pink-500/20 hover:scale-105 active:scale-100"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          hasLiked ? "fill-current" : ""
                        } transition-all duration-300`}
                      />
                      <span className="text-sm font-bold">{likes}</span>
                    </button>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/40 text-blue-300 shadow-lg shadow-blue-500/20">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-bold">
                        {confession.comments.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className="p-6 border-b border-purple-500/10 bg-gradient-to-br from-black/40 to-purple-500/5 backdrop-blur-sm"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/40 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                    {commentGender === "male"
                      ? "👨"
                      : commentGender === "female"
                      ? "👩"
                      : "🧑"}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <Select
                    value={commentGender}
                    onValueChange={setCommentGender}
                  >
                    <SelectTrigger className="w-[180px] h-11 bg-gradient-to-r from-black/60 to-purple-950/60 border-2 border-purple-500/40 text-white text-sm font-bold shadow-lg hover:border-purple-400/60 transition-all duration-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-2xl border-2 border-purple-500/40">
                      <SelectItem
                        value="male"
                        className="text-white text-sm font-medium"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className="text-white text-sm font-medium"
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value="others"
                        className="text-white text-sm font-medium"
                      >
                        Others
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts anonymously..."
                    rows={3}
                    maxLength={500}
                    className="w-full bg-gradient-to-br from-black/60 to-purple-950/40 border-2 border-purple-500/40 text-white text-sm placeholder-gray-400 resize-none rounded-xl focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/60 shadow-lg transition-all duration-300"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-medium">
                      {commentText.length}/500 characters
                    </p>
                    <Button
                      type="submit"
                      disabled={
                        !commentText.trim() || commentMutation.isPending
                      }
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 active:scale-100 disabled:opacity-50 disabled:hover:scale-100 h-11 px-6"
                    >
                      {commentMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="p-6">
              {confession.comments.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Replies ({confession.comments.length})
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                  </div>
                  {confession.comments.map((comment, idx) => (
                    <div
                      key={comment.id}
                      className="group flex gap-4 p-4 bg-gradient-to-br from-black/40 to-purple-950/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="relative shrink-0">
                        <Image
                          height={50}
                          width={1000}
                          src={generateAvatarUrl(
                            comment.gender,
                            comment.avatarSeed
                          )}
                          alt={comment.anonymousName}
                          className="w-11 h-11 rounded-full border-2 border-purple-500/30 shadow-md transition-all duration-300 group-hover:border-purple-400/50 group-hover:scale-105"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-black/80 shadow-md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <p className="text-sm font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            {comment.anonymousName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {confession.gender === "male"
                              ? "He/Him"
                              : confession.gender === "female"
                              ? "She/Her"
                              : "They/Them"}
                          </span>
                          <span className="text-xs text-gray-600">•</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    No replies yet. Be the first to respond!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
