"use client";

import { motion } from "framer-motion";

export default function WhyMeetink() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Messy background */}
      <div className="absolute inset-0 grain" />
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
        style={{ willChange: "transform" }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-blue-500/20 to-pink-500/20 rounded-full blur-3xl"
        style={{ willChange: "transform" }}
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial block */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Big chaotic heading */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-chaos leading-tight">
              <motion.span
                className="block transform -rotate-1 bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Swipe apps
              </motion.span>
              <motion.span
                className="block transform rotate-1 text-white mt-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                feel empty.
              </motion.span>
              <motion.span
                className="block transform -rotate-1 bg-linear-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mt-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                We&lsquo;re different.
              </motion.span>
            </h2>
          </motion.div>

          {/* Content grid - messy editorial layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left column */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="glass p-8 rounded-3xl transform -rotate-1">
                <h3 className="text-2xl font-bold mb-4 text-pink-400">
                  Real Communities
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Chemistry doesn&apos;t happen in a vacuum. It builds inside
                  real spaces—your campus, your neighborhood. We bring back the
                  magic of meeting people you actually cross paths with.
                </p>
              </div>

              <motion.div
                className="glass p-8 rounded-3xl transform rotate-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  Gen-Z Native
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Built by us, for us. No corporate algorithms deciding who you
                  should date. Just raw, honest, messy human connection. The way
                  it should be.
                </p>
              </motion.div>

              <motion.div
                className="relative"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
              >
                <div className="text-9xl opacity-20 select-none">💕</div>
              </motion.div>
            </motion.div>

            {/* Right column */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="glass p-8 rounded-3xl transform rotate-1"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-400">
                  Inclusive by Design
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  LGBTQ+ friendly isn't a feature—it's our foundation. Everyone
                  deserves a safe space to express themselves, explore
                  connections, and find love without fear.
                </p>
              </motion.div>

              <div className="glass p-8 rounded-3xl transform -rotate-1">
                <h3 className="text-2xl font-bold mb-4 text-pink-400">
                  Anonymous First
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Say what you really feel without the pressure. Confess,
                  explore, connect—all while staying anonymous. Reveal yourself
                  only when you're ready.
                </p>
              </div>

              <motion.div
                className="relative"
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
              >
                <div className="text-9xl opacity-20 select-none">✨</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom statement */}
          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-light text-luxury italic text-gray-300">
              &quot;Dating apps treat love like fast food.
              <br />
              <span className="text-gradient font-bold not-italic">
                We treat it like art.
              </span>
              &quot;
            </blockquote>
          </motion.div>

          {/* Decorative floating shapes */}
          <motion.div
            className="absolute -top-10 -right-10 w-20 h-20 border-4 border-pink-500/30 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-16 h-16 border-4 border-purple-500/30 rounded-full"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
