"use client";

import { Heart, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateAvatarUrl } from "@/lib/anonymousUtils";
import { graphqlRequest } from "@/lib/graphql";
import Image from "next/image";
import Link from "next/link";

interface Confession {
  id: string;
  content: string;
  category: string | null;
  likes: number;
  gender: string;
  anonymousName: string;
  avatarSeed: number;
  createdAt: string;
  commentsCount: number;
}

interface ConfessionCardProps {
  confession: Confession;
  onCommentAdded?: (confessionId: string) => void;
}

export default function ConfessionCard({
  confession,
  onCommentAdded,
}: ConfessionCardProps) {
  const [likes, setLikes] = useState(confession.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

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
      className={`group relative bg-gradient-to-br ${getCategoryColor(
        confession.category
      )} backdrop-blur-xl border rounded-2xl p-6 shadow-xl transition-transform duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 overflow-hidden will-change-transform`}
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-4">
          {confession.category && (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 shadow-lg shadow-black/20">
              <span className="text-base">
                {getCategoryEmoji(confession.category)}
              </span>
              <span className="tracking-wide">{confession.category}</span>
            </span>
          )}
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(confession.createdAt)}</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-white text-base leading-relaxed mb-6 min-h-20 font-medium">
          {confession.content}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
          <div className="relative">
            <Image
              height={50}
              width={50}
              src={generateAvatarUrl(confession.gender, confession.avatarSeed)}
              alt={confession.anonymousName}
              className="w-12 h-12 rounded-full border-2 border-purple-500/40 shadow-lg shadow-purple-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:border-purple-400/60"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-black/50 shadow-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {confession.anonymousName}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span>
                {confession.gender === "male"
                  ? "He/Him"
                  : confession.gender === "female"
                  ? "She/Her"
                  : "They/Them"}
              </span>
              <span className="text-gray-500">•</span>
              <span>Anonymous</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg ${
                hasLiked
                  ? "bg-gradient-to-r from-pink-500/40 to-rose-500/40 text-pink-300 border-2 border-pink-400/60 shadow-pink-500/30"
                  : "bg-black/40 text-gray-400 border-2 border-white/10 hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-rose-500/30 hover:text-pink-300 hover:border-pink-400/50 hover:shadow-pink-500/20 hover:scale-105 active:scale-100"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  hasLiked ? "fill-current" : ""
                } transition-all duration-300`}
              />
              <span className="text-sm font-bold">{likes}</span>
            </button>

            <Link
              href={`/confessions/${confession.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg border-2 bg-black/40 text-gray-400 border-white/10 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 hover:text-blue-300 hover:border-blue-400/50 hover:shadow-blue-500/20 hover:scale-105 active:scale-100"
            >
              <MessageCircle className="w-4 h-4 transition-all duration-300" />
              <span className="text-sm font-bold">
                {confession.commentsCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
