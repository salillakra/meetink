"use client";

import { Heart, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateAvatarUrl,
  generateAnonymousName,
  getRandomSeed,
} from "@/lib/anonymousUtils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { graphqlRequest } from "@/lib/graphql";

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

interface ConfessionCardProps {
  confession: Confession;
  onCommentAdded?: (confessionId: string, comment: Comment) => void;
}

export default function ConfessionCard({
  confession,
  onCommentAdded,
}: ConfessionCardProps) {
  const [likes, setLikes] = useState(confession.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentGender, setCommentGender] = useState("male");
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
      // Update with actual server data
      setLikes(data.likes);
      setIsLiking(false);
    },
    onError: () => {
      // Rollback optimistic update on error
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
            anonymous_name
            avatar_seed
            created_at
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

      const comment = result.createComment;
      return {
        id: comment.id,
        content: comment.content,
        gender: comment.gender,
        anonymousName: comment.anonymous_name,
        avatarSeed: comment.avatar_seed,
        createdAt: new Date(comment.created_at).toISOString(),
      };
    },
    onSuccess: (newComment) => {
      setCommentText("");
      setCommentGender("male");

      // If parent provided a handler, call it so parent can update its local state immediately
      if (onCommentAdded && typeof onCommentAdded === "function") {
        try {
          onCommentAdded(confession.id, newComment as Comment);
          return;
        } catch (e) {
          // Fall back to invalidating queries if callback fails
        }
      }

      // Fallback: invalidate queries so other approaches still update
      queryClient.invalidateQueries({ queryKey: ["confessions"] });
    },
  });

  const handleLike = () => {
    if (!hasLiked && !isLiking) {
      // Optimistic update - instant feedback
      setIsLiking(true);
      setHasLiked(true);
      setLikes((prev) => prev + 1);

      // API call in background
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
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "Love":
        return "from-pink-500/20 to-red-500/20 border-pink-500/30";
      case "Career":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
      case "Family":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30";
      case "Friendship":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case "Secret":
        return "from-purple-500/20 to-indigo-500/20 border-purple-500/30";
      default:
        return "from-gray-500/20 to-slate-500/20 border-gray-500/30";
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
    <div
      className={`bg-linear-to-br ${getCategoryColor(
        confession.category
      )} backdrop-blur-md border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1`}
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3 sm:mb-4">
        {confession.category && (
          <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-semibold text-white border border-white/20 shadow-sm">
            <span>{getCategoryEmoji(confession.category)}</span>
            {confession.category}
          </span>
        )}
        <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs font-medium">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>{formatDate(confession.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-white text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 min-h-[60px]">
        {confession.content}
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/10">
        <img
          src={generateAvatarUrl(confession.gender, confession.avatarSeed)}
          alt={confession.anonymousName}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-500/30 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-white truncate">
            {confession.anonymousName}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            {confession.gender === "male" ? " Male" : " Female"} • Anonymous
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 font-medium ${
              hasLiked
                ? "bg-pink-500/30 text-pink-400 border border-pink-500/50 shadow-lg shadow-pink-500/20"
                : "bg-black/30 text-gray-400 border border-white/10 hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30 hover:scale-105 active:scale-95"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                hasLiked ? "fill-current" : ""
              } transition-all duration-200`}
            />
            <span className="text-xs sm:text-sm font-semibold">{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 font-medium bg-black/30 text-gray-400 border border-white/10 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold">
              {confession.comments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Comment Form */}
          <form
            onSubmit={handleCommentSubmit}
            className="mb-3 sm:mb-4 space-y-2.5"
          >
            <div>
              <Select value={commentGender} onValueChange={setCommentGender}>
                <SelectTrigger className="w-full sm:w-[140px] h-8 sm:h-9 bg-black/50 border-purple-500/30 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-xl border-purple-500/30">
                  <SelectItem value="male" className="text-white text-xs">
                    👨 Male
                  </SelectItem>
                  <SelectItem value="female" className="text-white text-xs">
                    👩 Female
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                maxLength={500}
                className="w-full bg-black/50 border-purple-500/30 text-white text-xs sm:text-sm placeholder-gray-500 resize-none rounded-lg focus:ring-2 focus:ring-purple-500/50"
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[9px] sm:text-[10px] text-gray-500">
                  {commentText.length}/500
                </p>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!commentText.trim() || commentMutation.isPending}
              className="w-full h-9 sm:h-10 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin mr-2" />
                  <span className="text-xs sm:text-sm">Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5 mr-2" />
                  <span className="text-xs sm:text-sm">Post Comment</span>
                </>
              )}
            </Button>
          </form>

          {/* Comments List */}
          {confession.comments.length > 0 ? (
            <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
              {confession.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-2 p-2.5 sm:p-3 bg-black/30 rounded-lg border border-white/5 animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  <img
                    src={generateAvatarUrl(comment.gender, comment.avatarSeed)}
                    alt={comment.anonymousName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-purple-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                      <p className="text-[11px] sm:text-xs font-semibold text-white">
                        {comment.anonymousName}
                      </p>
                      <span className="text-[9px] sm:text-[10px] text-gray-500">
                        {comment.gender === "male" ? "👨" : "👩"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-gray-500">
                        •
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 wrap-break-word">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xs sm:text-sm py-3 sm:py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
