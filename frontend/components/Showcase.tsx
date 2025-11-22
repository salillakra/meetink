"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Heart, MessageCircle, Sparkles } from "lucide-react";

// Pre-defined particle positions (outside component to avoid re-renders)
const PARTICLES = [
  { id: 0, color: "#ec4899", top: 15, left: 20, duration: 3.2 },
  { id: 1, color: "#a855f7", top: 45, left: 75, duration: 2.5 },
  { id: 2, color: "#3b82f6", top: 85, left: 30, duration: 3.8 },
  { id: 3, color: "#ec4899", top: 25, left: 85, duration: 2.9 },
  { id: 4, color: "#a855f7", top: 60, left: 15, duration: 3.5 },
  { id: 5, color: "#3b82f6", top: 35, left: 50, duration: 2.7 },
  { id: 6, color: "#ec4899", top: 70, left: 65, duration: 3.1 },
  { id: 7, color: "#a855f7", top: 10, left: 40, duration: 2.6 },
  { id: 8, color: "#3b82f6", top: 55, left: 90, duration: 3.4 },
  { id: 9, color: "#ec4899", top: 90, left: 55, duration: 2.8 },
  { id: 10, color: "#a855f7", top: 20, left: 10, duration: 3.6 },
  { id: 11, color: "#3b82f6", top: 75, left: 45, duration: 3.3 },
];

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const smoothX1 = useSpring(x1, { stiffness: 50, damping: 20, mass: 0.5 });
  const smoothX2 = useSpring(x2, { stiffness: 50, damping: 20, mass: 0.5 });

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-purple-950/20 to-black grain" />

      {/* Animated background blob */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-linear-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl"
        style={{ willChange: "transform" }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div style={{ opacity }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 text-chaos">
              <span className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                See It Live
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-luxury px-4">
              A glimpse into the Meetink experience
            </p>
          </motion.div>

          {/* Timeline of features */}
          <div className="space-y-20 md:space-y-32">
            {/* Confession Feed */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <motion.h3
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-linear-to-r from-pink-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                    Anonymous Confession Feed
                  </span>
                </motion.h3>
                <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                  Express yourself freely. Confess to someone specific or
                  broadcast to your entire campus. Watch as confessions create
                  connections.
                </p>
                <ul className="space-y-3 md:space-y-4 text-gray-300">
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Heart
                      className="w-5 h-5 text-pink-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Complete anonymity until you choose to reveal
                    </span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Sparkles
                      className="w-5 h-5 text-purple-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Filter by campus, interests, or orientation
                    </span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <MessageCircle
                      className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      React and engage without identity exposure
                    </span>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Confession cards - offset to the right */}
              <motion.div
                className="relative order-1 lg:order-2 lg:translate-x-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div style={{ x: smoothX1 }} className="relative">
                  <div className="glass rounded-3xl p-6 md:p-8 space-y-4 glow relative overflow-hidden">
                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 bg-pink-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-8 left-8 w-2 h-2 bg-purple-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                      }}
                    />

                    {/* Mock confession cards */}
                    {[
                      {
                        id: "confession-1",
                        text: "To the person in the red hoodie at the library...",
                        color: "from-pink-500 to-rose-500",
                        emoji: "💌",
                        likes: 23,
                        comments: 5,
                        time: "2h ago",
                      },
                      {
                        id: "confession-2",
                        text: "Saw him near nescafe, I loved his styling and confidence",
                        color: "from-purple-500 to-pink-500",
                        emoji: "💭",
                        likes: 45,
                        comments: 12,
                        time: "4h ago",
                      },
                      {
                        id: "confession-3",
                        text: "Looking for someone who loves indie music 🎵",
                        color: "from-blue-500 to-purple-500",
                        emoji: "🎶",
                        likes: 67,
                        comments: 8,
                        time: "1d ago",
                      },
                    ].map((confession, i) => (
                      <motion.div
                        key={confession.id}
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{ willChange: "transform" }}
                      >
                        {/* Hover gradient effect */}
                        <motion.div
                          className={`absolute inset-0 bg-linear-to-br ${confession.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                        />

                        <div className="relative flex items-start gap-3 md:gap-4">
                          <motion.div
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-linear-to-br ${confession.color} flex items-center justify-center text-2xl md:text-3xl shrink-0 shadow-lg`}
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                          >
                            {confession.emoji}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm md:text-base leading-relaxed mb-3">
                              {confession.text}
                            </p>
                            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-400">
                              <motion.button
                                className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Heart className="w-4 h-4" />
                                <span>{confession.likes}</span>
                              </motion.button>
                              <motion.button
                                className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>{confession.comments}</span>
                              </motion.button>
                              <span className="ml-auto">{confession.time}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Match Flow */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                className="relative order-2 lg:order-1 lg:-translate-x-12"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.div style={{ x: smoothX2 }} className="relative">
                  <div className="glass rounded-3xl p-8 md:p-12 glow relative overflow-hidden">
                    {/* Confetti effect */}
                    {PARTICLES.map((particle) => (
                      <motion.div
                        key={`particle-${particle.id}`}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: particle.color,
                          top: `${particle.top}%`,
                          left: `${particle.left}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: particle.duration,
                          repeat: Infinity,
                          delay: particle.id * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}

                    <div className="text-center space-y-6 relative z-10">
                      <motion.div
                        className="inline-block"
                        animate={{
                          rotate: [0, 3, -3, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{ willChange: "transform" }}
                      >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-6xl md:text-7xl shadow-2xl">
                          ✨
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          It&apos;s a Match!
                        </h4>
                        <p className="text-gray-400 text-sm md:text-base">
                          You both confessed interest. Time to make it real.
                        </p>
                      </motion.div>

                      <motion.button
                        className="group relative px-8 py-4 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full text-white font-semibold text-base md:text-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
                          initial={{ x: "100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                          Start Chatting
                          <Heart className="w-5 h-5" />
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.h3
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-linear-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
                    Swipe-less Matching
                  </span>
                </motion.h3>
                <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                  No endless swiping. No ghosting. When two confessions align,
                  magic happens. Chemistry over algorithms.
                </p>
                <ul className="space-y-3 md:space-y-4 text-gray-300">
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles
                      className="w-5 h-5 text-pink-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Mutual confession = instant connection
                    </span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Heart
                      className="w-5 h-5 text-purple-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      No superficial judgments, just genuine interest
                    </span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <MessageCircle
                      className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Built-in conversation starters from confessions
                    </span>
                  </motion.li>
                </ul>
              </motion.div>
            </div>

            {/* LGBTQ+ Safety */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.h3
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Safe Space for Everyone
                  </span>
                </motion.h3>
                <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
                  Built with LGBTQ+ community in mind from day one. Your
                  identity, your choice, your safety.
                </p>
                <ul className="space-y-3 md:space-y-4 text-gray-300">
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles
                      className="w-5 h-5 text-pink-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Pronouns & orientation in profiles
                    </span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Heart
                      className="w-5 h-5 text-purple-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Filter matches by identity preferences
                    </span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <MessageCircle
                      className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                      fill="currentColor"
                    />
                    <span className="text-sm md:text-base">
                      Report system with zero-tolerance policy
                    </span>
                  </motion.li>
                </ul>
              </motion.div>

              <motion.div
                className="relative order-1 lg:order-2 lg:translate-x-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.div style={{ x: smoothX1 }} className="relative">
                  <div className="glass rounded-3xl p-6 md:p-8 glow relative overflow-hidden">
                    {/* Animated gradient orb */}
                    <motion.div
                      className="absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <div className="space-y-4 md:space-y-5 relative z-10">
                      <motion.h4
                        className="text-xl md:text-2xl font-semibold text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        Your Identity, Your Way
                      </motion.h4>
                      {[
                        { label: "Pronouns", value: "they/them", icon: "✨" },
                        {
                          label: "Orientation",
                          value: "Pansexual",
                          icon: "🌈",
                        },
                        {
                          label: "Looking for",
                          value: "All genders",
                          icon: "💖",
                        },
                        {
                          label: "Visibility",
                          value: "LGBTQ+ only",
                          icon: "🔒",
                        },
                      ].map((field, i) => (
                        <motion.div
                          key={field.label}
                          className="group bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{field.icon}</span>
                            <div className="flex-1">
                              <div className="text-xs md:text-sm text-gray-400 mb-1">
                                {field.label}
                              </div>
                              <div className="text-sm md:text-base text-white font-medium">
                                {field.value}
                              </div>
                            </div>
                            <motion.div
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ x: 5 }}
                            >
                              {/** biome-ignore lint/a11y/noSvgWithoutTitle: <idk> */}
                              <svg
                                className="w-5 h-5 text-purple-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
