"use client";

import { motion } from "framer-motion";
import { MapPin, MessageSquare, Heart, Shield, Eye, Bell } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Hyper-Local Matchmaking",
    description:
      "Match only within your campus or institute. Real connections start with proximity.",
    gradient: "from-pink-500 to-rose-500",
    rotation: -2,
    offset: "mt-0",
  },
  {
    icon: MessageSquare,
    title: "Anonymous Confessions",
    description:
      "Confess to someone specific or broadcast to your institute. Express yourself freely.",
    gradient: "from-purple-500 to-pink-500",
    rotation: 1,
    offset: "mt-12",
  },
  {
    icon: Heart,
    title: "Confession-to-Match Pipeline",
    description:
      "Mutual confession interest = instant match. Let chemistry do its thing.",
    gradient: "from-blue-500 to-purple-500",
    rotation: -1,
    offset: "mt-6",
  },
  {
    icon: Shield,
    title: "LGBTQ+ Friendly by Default",
    description:
      "Identity-safe onboarding, pronouns, orientation matching. A safe space for everyone.",
    gradient: "from-pink-500 to-purple-500",
    rotation: 2,
    offset: "mt-16",
  },
  {
    icon: Eye,
    title: "Identity-Safe Discovery",
    description:
      "Stay anonymous until you want to reveal. Control your visibility, control your story.",
    gradient: "from-purple-500 to-blue-500",
    rotation: -1,
    offset: "mt-8",
  },
  {
    icon: Bell,
    title: "Location-Triggered Alerts",
    description:
      "Real-time updates based on your radius. Never miss a connection opportunity.",
    gradient: "from-rose-500 to-pink-500",
    rotation: 1,
    offset: "mt-20",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grain opacity-50" />
      <motion.div
        className="absolute top-1/4 right-0 w-96 h-96 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-chaos"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Built Different
            </span>
          </motion.h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto text-luxury">
            Because swipe apps feel empty. Real chemistry happens in real
            communities.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={`${feature.offset}`}
            >
              <motion.div
                className={`relative p-8 glass rounded-3xl transform rotate-[${feature.rotation}deg] h-full group cursor-pointer`}
                whileHover={{
                  scale: 1.05,
                  rotateZ: 0,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                whileTap={{ scale: 0.98 }}
                style={{ rotate: feature.rotation }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                />

                {/* Neon border on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-opacity-50`}
                  style={{
                    borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`,
                  }}
                  whileHover={{
                    boxShadow: `0 0 30px rgba(236, 72, 153, 0.3)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-purple-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
