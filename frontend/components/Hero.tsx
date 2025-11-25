"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Hyperspeed from "./Hyperspeed";
import UserMenu from "./UserMenu";

export default function Hero() {
  const scrollToEarlyAccess = () => {
    const earlyAccessSection = document.getElementById("early-access");
    if (earlyAccessSection) {
      earlyAccessSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* User menu in top right */}
      <div className="absolute top-8 right-8 z-20">
        <UserMenu />
      </div>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-slate-950/30  absolute inset-0 z-10"></div>
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xffffff,
              brokenLines: 0xffffff,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3,
            },
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Floating icons */}
          <motion.div
            className="flex justify-center gap-6 lg:mt-8c mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-12 h-12 text-pink-500" fill="currentColor" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Sparkles
                className="w-12 h-12 text-purple-500"
                fill="currentColor"
              />
            </motion.div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-7xl sm:text-8xl lg:text-[12rem] font-bold leading-none mb-6 text-chaos"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: [0.6, 0.05, 0.01, 0.9],
            }}
          >
            <span className="block transform -rotate-2 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Meet
            </span>
            <span className="block transform rotate-1 bg-linear-to-r from-blue-500 via-pink-500 to-purple-500 bg-clip-text text-transparent -mt-4">
              ink
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light text-luxury"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Where campus chemistry meets anonymous confessions.
            <br />
            <span className="text-pink-400">LGBTQ+ friendly.</span>{" "}
            <span className="text-purple-400">Location-based.</span>{" "}
            <span className="text-blue-400">Real connections.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToEarlyAccess}
              className="group relative px-8 py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Join Early Access
                <Heart className="w-5 h-5" />
              </span>
            </motion.button>

            <Link href="/confessions">
              <motion.button
                className="group px-8 py-4 glass rounded-full text-white font-semibold text-lg glow-hover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Confessions
                <Sparkles className="inline-block w-5 h-5 ml-2" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">500+</div>
              <div className="text-gray-400 text-sm mt-1">Early Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">50+</div>
              <div className="text-gray-400 text-sm mt-1">Campuses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">2K+</div>
              <div className="text-gray-400 text-sm mt-1">Confessions</div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
