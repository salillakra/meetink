import { Sparkles, ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { graphqlRequest } from "@/lib/graphql";
import ConfessionsClient from "../../components/ConfessionsClient";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

interface GQLComment {
  id: string;
  content: string;
  gender: string;
  anonymousName: string;
  avatarSeed: number;
  createdAt: string;
}

interface GQLConfession {
  id: string;
  content: string;
  category: string | null;
  likes: number;
  gender: string;
  anonymousName: string;
  avatarSeed: number;
  createdAt: string;
  comments: GQLComment[];
}

async function getConfessions(): Promise<Confession[]> {
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
  const confessions = (data.confessions || []) as GQLConfession[];

  return confessions.map((c: GQLConfession) => ({
    id: c.id,
    content: c.content,
    category: c.category,
    likes: c.likes,
    gender: c.gender,
    anonymousName: c.anonymousName,
    avatarSeed: c.avatarSeed,
    createdAt: new Date(c.createdAt).toISOString(),
    comments: (c.comments || []).map((cm: GQLComment) => ({
      id: cm.id,
      content: cm.content,
      gender: cm.gender,
      anonymousName: cm.anonymousName,
      avatarSeed: cm.avatarSeed,
      createdAt: new Date(cm.createdAt).toISOString(),
    })),
  }));
}

export default async function ConfessionsPage() {
  const confessions = await getConfessions();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black grain">
      {/* Animated background blobs with CSS animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-linear-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-linear-to-br from-blue-500/30 to-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-linear-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">
              Back to Home
            </span>
          </Link>

          <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="animate-wiggle shrink-0">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Confessions
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Share anonymously, connect authentically
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/40 rounded-full backdrop-blur-sm self-start">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="text-xs sm:text-sm font-bold text-orange-300">
                BIT Mesra Confessions
              </span>
            </div>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl">
            Share your thoughts anonymously or read what others have to say. All
            confessions are completely anonymous.
          </p>
        </div>

        {/* Client-side interactive components */}
        <ConfessionsClient confessions={confessions} />
      </div>
    </main>
  );
}
