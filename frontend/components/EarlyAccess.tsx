"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Mail, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ToastProvider";
import { graphqlRequest } from "@/lib/graphql";

interface EarlyAccessData {
  email: string;
  name: string;
}

export default function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: EarlyAccessData) => {
      const mutation = `
        mutation CreateEarlyAccess($email: String!, $name: String!) {
          createEarlyAccess(email: $email, name: $name) {
            id
            email
            name
          }
        }
      `;

      return await graphqlRequest(mutation, {
        email: data.email,
        name: data.name,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      setName("");
      toast({
        title: "You're on the list!",
        description: "Check your email for next steps.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      const msg = err?.message || "Failed to join waitlist";
      toast({ title: "Error", description: msg, type: "error" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, name: name.trim() });
  };

  return (
    <section id="early-access" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grain" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl"
        style={{ willChange: "transform, opacity" }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {!submitted ? (
            <div className="glass rounded-3xl p-12 glow">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="inline-block mb-6"
                  animate={{
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ willChange: "transform" }}
                >
                  <Sparkles className="w-16 h-16 text-purple-500" />
                </motion.div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-chaos">
                  <span className="bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Get Early Access
                  </span>
                </h2>
                <p className="text-xl text-gray-300 text-luxury">
                  Join the waitlist and be among the first to experience Meetink
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@campus.edu"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {mutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4"
                  >
                    {mutation.error?.message ||
                      "Something went wrong. Please try again."}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-semibold text-lg glow-hover relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
                  whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {mutation.isPending ? "Joining..." : "Join the Waitlist"}
                  </span>
                </motion.button>
              </motion.form>

              {/* Features list */}
              <motion.div
                className="mt-8 pt-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-400 text-center mb-4">
                  What you will get:
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-2">🎉</div>
                    <p className="text-sm text-gray-300">Priority access</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">💎</div>
                    <p className="text-sm text-gray-300">Exclusive perks</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">🚀</div>
                    <p className="text-sm text-gray-300">Launch updates</p>
                  </div>
                </div>
              </motion.div>

              {/* Privacy note */}
              <p className="text-xs text-gray-500 text-center mt-6">
                We respect your privacy. No spam, just updates.
              </p>
            </div>
          ) : (
            <motion.div
              className="glass rounded-3xl p-12 text-center glow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              {/* Success state */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="text-8xl mb-6">🎉</div>
              </motion.div>

              <motion.h3
                className="text-4xl font-bold mb-4 text-gradient"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                You are in!
              </motion.h3>

              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Check your email for next steps. Welcome to the Meetink family!
              </motion.p>

              {/* Confetti elements */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ["#ec4899", "#a855f7", "#3b82f6"][i % 3],
                    left: `${50}%`,
                    top: `${50}%`,
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i / 20) * Math.PI * 2) * 200,
                    y: Math.sin((i / 20) * Math.PI * 2) * 200,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}

              <motion.button
                onClick={() => setSubmitted(false)}
                className="text-purple-400 hover:text-purple-300 underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Submit another email
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
