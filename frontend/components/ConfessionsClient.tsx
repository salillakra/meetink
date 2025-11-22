"use client";

import { useState } from "react";
import { Filter, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ConfessionForm from "@/components/ConfessionForm";
import ConfessionCard from "@/components/ConfessionCard";
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

interface ConfessionsClientProps {
  confessions: Confession[];
}

export default function ConfessionsClient({
  confessions: initialConfessions,
}: ConfessionsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "General",
    "Love",
    "Career",
    "Family",
    "Friendship",
    "Secret",
  ];

  // Fetch confessions from API based on selected category
  const {
    data: confessionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["confessions", selectedCategory],
    queryFn: async () => {
      const query = `
        query Confessions {
          confessions {
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

      const data = await graphqlRequest(query);
      return (data.confessions || []).map((c: any) => ({
        id: c.id,
        content: c.content,
        category: c.category,
        likes: c.likes,
        gender: c.gender,
        anonymousName: c.anonymousName,
        avatarSeed: c.avatarSeed,
        createdAt: new Date(c.createdAt).toISOString(),
        comments: (c.comments || []).map((cm: any) => ({
          id: cm.id,
          content: cm.content,
          gender: cm.gender,
          anonymousName: cm.anonymousName,
          avatarSeed: cm.avatarSeed,
          createdAt: new Date(cm.createdAt).toISOString(),
        })),
      })) as Confession[];
    },
    initialData: selectedCategory === "all" ? initialConfessions : undefined,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const confessions = confessionsData || [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleConfessionSubmitted = async () => {
    // Refetch current category after submission
    refetch();
  };

  // Update local confessions when a new comment is added to a confession
  const handleCommentAdded = () => {
    // Invalidate and refetch to get updated data from server
    refetch();
  };

  return (
    <>
      {/* Confession Form */}
      <div className="mb-12 animate-fade-in-up animation-delay-200">
        <ConfessionForm onConfessionSubmitted={handleConfessionSubmitted} />
      </div>

      {/* Category Filter */}
      <div className="mb-6 sm:mb-8 animate-fade-in-up animation-delay-400">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">
            Filter by Category
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => {
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={isLoading}
                className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50"
                    : "bg-black/30 text-gray-400 border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confessions List */}
      <div>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <p className="text-gray-400">Loading confessions...</p>
          </div>
        ) : confessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 animate-fade-in">
            {confessions.map((confession, index) => (
              <div
                key={confession.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ConfessionCard
                  confession={confession}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/20 mb-6 border border-purple-500/30">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No confessions yet
            </h3>
            <p className="text-gray-400">
              Be the first to share your thoughts anonymously in this category!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
