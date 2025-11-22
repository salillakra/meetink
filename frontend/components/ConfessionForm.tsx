"use client";

import { useState } from "react";
import { Send, Loader2, GraduationCap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { graphqlRequest } from "@/lib/graphql";
import { generateAnonymousName, getRandomSeed } from "@/lib/anonymousUtils";

interface ConfessionFormProps {
  onConfessionSubmitted: () => void;
}

export default function ConfessionForm({
  onConfessionSubmitted,
}: ConfessionFormProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [gender, setGender] = useState("male");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const categories = [
    "General",
    "Love",
    "Career",
    "Family",
    "Friendship",
    "Secret",
  ];

  const confessionMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      category: string;
      gender: string;
    }) => {
      const avatarSeed = getRandomSeed();
      const anonymousName = generateAnonymousName(avatarSeed);

      const mutation = `
        mutation CreateConfession(
          $content: String!,
          $category: String,
          $gender: String!,
          $anonymousName: String!,
          $avatarSeed: Int!
        ) {
          createConfession(
            content: $content,
            category: $category,
            gender: $gender,
            anonymousName: $anonymousName,
            avatarSeed: $avatarSeed
          ) {
            id
            content
            category
            likes
          }
        }
      `;

      return await graphqlRequest(mutation, {
        content: data.content,
        category: data.category,
        gender: data.gender,
        anonymousName,
        avatarSeed,
      });
    },
    onSuccess: () => {
      setContent("");
      setCategory("General");
      setGender("male");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["confessions"] });
      onConfessionSubmitted();
    },
    onError: (error: Error) => {
      setError(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please write your confession");
      return;
    }

    if (content.length > 1000) {
      setError("Confession is too long. Maximum 1000 characters.");
      return;
    }

    confessionMutation.mutate({ content: content.trim(), category, gender });
  };

  return (
    <div className="bg-linear-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-lg border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
            <Send className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            Share Your Confession
          </h2>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-linear-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full self-start">
          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
          <span className="text-[10px] sm:text-xs font-semibold text-orange-300">
            BIT Mesra
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label
              htmlFor="category"
              className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2"
            >
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-10 sm:h-12 bg-black/50 border-purple-500/30 hover:bg-black/70 focus:ring-2 focus:ring-purple-500/50 rounded-lg sm:rounded-xl text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-xl border-purple-500/30">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-white  hover:bg-pink-200/20 focus:bg-pink-200/30 cursor-pointer"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2"
            >
              Your Gender <span className="text-purple-400">(Anonymous)</span>
            </label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full h-10 sm:h-12 bg-black/50 border-purple-500/30 text-white hover:bg-black/70 focus:ring-2 focus:ring-purple-500/50 rounded-lg sm:rounded-xl text-sm">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-xl border-purple-500/30">
                <SelectItem
                  value="male"
                  className="text-white hover:bg-pink-200/20 focus:bg-pink-200/30  cursor-pointer"
                >
                  Male
                </SelectItem>
                <SelectItem
                  value="female"
                  className="text-white hover:bg-pink-200/20 focus:bg-pink-200/30  cursor-pointer"
                >
                  Female
                </SelectItem>
                <SelectItem
                  value="other"
                  className="text-white hover:bg-pink-200/20 focus:bg-pink-200/30  cursor-pointer"
                >
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label
            htmlFor="confession"
            className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2"
          >
            Your Confession <span className="text-purple-400">(Anonymous)</span>
          </label>
          <Textarea
            id="confession"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts anonymously... No one will know it's you. 🤫"
            rows={5}
            maxLength={1000}
            className="w-full bg-black/50 border-purple-500/30 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 rounded-lg sm:rounded-xl resize-none text-sm sm:text-base"
          />
          <div className="flex justify-between items-center mt-2 sm:mt-2.5 gap-2">
            <span className="text-[10px] sm:text-xs font-medium text-gray-400">
              {content.length}/1000
            </span>
            {error && (
              <span className="text-[10px] sm:text-xs font-medium text-red-400 animate-pulse text-right">
                {error}
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={confessionMutation.isPending}
          className="w-full h-12 sm:h-14 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          {confessionMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Anonymously
            </>
          )}
        </Button>
      </form>

      <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-4 sm:mt-6 leading-relaxed">
        🔒 Your confession is completely anonymous. We don&apos;t store any
        identifying information.
      </p>
    </div>
  );
}
