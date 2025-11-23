"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Heart,
  Clock,
  MessageCircle,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql";
import {
  generateAvatarUrl,
  generateAnonymousName,
  getRandomSeed,
} from "@/lib/anonymousUtils";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function ConfessionPage() {
  const params = useParams();
  const router = useRouter();
  const confessionId = params.id as string;
  const [commentText, setCommentText] = useState("");
  const [commentGender, setCommentGender] = useState("male");
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const queryClient = useQueryClient();

  // Fetch single confession
  const { data: confession, isLoading } = useQuery({
    queryKey: ["confession", confessionId],
    queryFn: async () => {
      const query = `
        query GetConfession($confessionId: String!) {
          confession(confessionId: $confessionId) {
            id
            content
            category
            likes
            gender
            anonymousName
            avatarSeed
            createdAt
            comments {
              id
              content
              gender
              anonymousName
              avatarSeed
              createdAt
            }
          }
        }
      `;

      const data = await graphqlRequest(query, { confessionId });
      const confession = data.confession as Confession;

      // ensure comments array exists
      if (confession && !confession.comments) {
        confession.comments = [];
      }

      return confession;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const mutation = `
        mutation LikeConfession($confessionId: String!) {
          likeConfession(confessionId: $confessionId)
        }
      `;
      const data = await graphqlRequest(mutation, {
        confessionId: confessionId,
      });
      return { likes: data.likeConfession };
    },
    onSuccess: () => {
      setIsLiking(false);
      queryClient.invalidateQueries({ queryKey: ["confession", confessionId] });
      queryClient.invalidateQueries({ queryKey: ["confessions"] });
    },
    onError: () => {
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
        confessionId: confessionId,
        content: data.content,
        gender: data.gender,
        anonymousName,
        avatarSeed,
      });

      return result.createComment as Comment;
    },
    onSuccess: () => {
      setCommentText("");
      setCommentGender("male");
      queryClient.invalidateQueries({ queryKey: ["confession", confessionId] });
      queryClient.invalidateQueries({ queryKey: ["confessions"] });
    },
  });

  const handleLike = () => {
    if (!hasLiked && !isLiking) {
      setIsLiking(true);
      setHasLiked(true);
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

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black grain">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 to-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <p className="text-gray-400">Loading confession...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!confession) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black grain">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 to-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/confessions"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base font-medium">Back to Confessions</span>
          </Link>
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Confession not found</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black grain">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 -left-10 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-pink-500/20 sm:from-pink-500/30 to-purple-500/20 sm:to-purple-500/30 rounded-full blur-2xl sm:blur-3xl animate-blob" />
        <div className="absolute bottom-10 sm:bottom-20 -right-10 sm:right-10 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-gradient-to-br from-blue-500/20 sm:from-blue-500/30 to-pink-500/20 sm:to-pink-500/30 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Back button */}
        <Link
          href="/confessions"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 active:text-purple-200 transition-colors mb-4 sm:mb-6 group touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium">
            Back to Confessions
          </span>
        </Link>

        {/* Confession Card */}
        <div
          className={`bg-gradient-to-br ${getCategoryColor(
            confession.category
          )} backdrop-blur-md sm:backdrop-blur-xl border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl mb-6 sm:mb-8 will-change-transform`}
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
            {confession.category && (
              <span className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/60 backdrop-blur-md rounded-full text-xs sm:text-sm font-bold text-white border border-white/20 shadow-lg shadow-black/20">
                <span className="text-base sm:text-lg">
                  {getCategoryEmoji(confession.category)}
                </span>
                <span className="tracking-wide">{confession.category}</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {formatDate(confession.createdAt)}
              </span>
              <span className="sm:hidden">
                {formatDate(confession.createdAt)
                  .replace(" ago", "")
                  .replace(" minutes", "m")
                  .replace(" hours", "h")
                  .replace(" days", "d")}
              </span>
            </div>
          </div>

          {/* Content */}
          <p className="text-white text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 font-medium">
            {confession.content}
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-white/10">
            <div className="relative">
              <Image
                height={56}
                width={56}
                src={generateAvatarUrl(
                  confession.gender,
                  confession.avatarSeed
                )}
                alt={confession.anonymousName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-purple-500/40 shadow-lg shadow-purple-500/20"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-black/50 shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {confession.anonymousName}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 sm:gap-2">
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
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg touch-manipulation ${
                hasLiked
                  ? "bg-gradient-to-r from-pink-500/40 to-rose-500/40 text-pink-300 border-2 border-pink-400/60 shadow-pink-500/30"
                  : "bg-black/40 text-gray-400 border-2 border-white/10 hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-rose-500/30 hover:text-pink-300 hover:border-pink-400/50 hover:shadow-pink-500/20 active:scale-95"
              }`}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  hasLiked ? "fill-current" : ""
                } transition-all duration-300`}
              />
              <span className="text-sm sm:text-base font-bold">
                {confession.likes}
              </span>
            </button>

            <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/40 text-blue-300 shadow-lg shadow-blue-500/20">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-bold">
                {confession.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <div className="bg-gradient-to-br from-black/60 to-purple-950/40 backdrop-blur-md sm:backdrop-blur-xl border-2 border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl border border-purple-400/30">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <span className="text-base sm:text-xl">Share Your Thoughts</span>
          </h2>

          <form
            onSubmit={handleCommentSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/40 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-purple-500/20">
                  {commentGender === "male"
                    ? "👨"
                    : commentGender === "female"
                    ? "👩"
                    : "🧑"}
                </div>
              </div>
              <div className="flex-1 space-y-3 sm:space-y-4">
                <Select value={commentGender} onValueChange={setCommentGender}>
                  <SelectTrigger className="w-full sm:w-[200px] h-10 sm:h-11 bg-gradient-to-r from-black/60 to-purple-950/60 border-2 border-purple-500/40 text-white text-sm font-bold shadow-lg hover:border-purple-400/60 transition-all duration-300 touch-manipulation">
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
                  className="w-full bg-gradient-to-br from-black/60 to-purple-950/40 border-2 border-purple-500/40 text-white text-sm sm:text-base placeholder-gray-400 resize-none rounded-xl focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/60 shadow-lg transition-all duration-300 touch-manipulation"
                />
                <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">
                    {commentText.length}/500
                  </p>
                  <Button
                    type="submit"
                    disabled={!commentText.trim() || commentMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 active:scale-95 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:hover:scale-100 h-10 sm:h-11 px-5 sm:px-6 text-sm sm:text-base touch-manipulation"
                  >
                    {commentMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments Section */}
        <div className="bg-gradient-to-br from-black/40 to-purple-950/20 backdrop-blur-md sm:backdrop-blur-xl border-2 border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            Replies ({confession.comments?.length || 0})
          </h2>

          {confession.comments && confession.comments.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {confession.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="group flex gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-black/40 to-purple-950/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-500/20 active:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 will-change-transform"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                >
                  <div className="relative shrink-0">
                    <Image
                      height={48}
                      width={48}
                      src={generateAvatarUrl(
                        comment.gender,
                        comment.avatarSeed
                      )}
                      alt={comment.anonymousName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-purple-500/30 shadow-md transition-all duration-300"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-black/80 shadow-md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                      <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {comment.anonymousName}
                      </p>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {comment.gender === "male"
                          ? "He/Him"
                          : comment.gender === "female"
                          ? "She/Her"
                          : "They/Them"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        •
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12">
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">
                No replies yet. Be the first to respond!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
