/**
 * Material 3D Hero Section
 * Parallax hero with animated statistics and CTAs
 */

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button3D from "./ui/Button3D";
import GitHubIcon from "@mui/icons-material/GitHub";
import SpeedIcon from "@mui/icons-material/Speed";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const stats = [
    { icon: <GitHubIcon />, value: "Any Repo", label: "Paste & Go" },
    { icon: <SpeedIcon />, value: "<2s", label: "Query Response" },
    { icon: <DescriptionIcon />, value: "RAG", label: "Source-Cited Answers" },
    { icon: <AutoAwesomeIcon />, value: "Granite", label: "IBM watsonx.ai" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20"
      style={{ position: "relative" }}
    >
      {/* Animated Background */}
      <motion.div className="absolute inset-0 -z-10 bg-[#09090b]" style={{ y, willChange: "transform" }}>
        {/* Industrial Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)", backgroundSize: "3rem 3rem" }} />

        {/* Floating Neon Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[120px]"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        />
      </motion.div>

      <motion.div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ opacity }}>
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="glass px-6 py-2 rounded-none border border-zinc-800 bg-zinc-900/50 backdrop-blur-md inline-flex items-center gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-sm font-mono tracking-wide text-zinc-300">
                POWERED BY IBM WATSONX.AI
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white uppercase">
              CHAT WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">YOUR CODE</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              AI-powered static analysis meets vector search. Query your repository structure, trace logic, and get source-cited answers instantly.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center items-center pt-4"
          >
            <Button3D
              variant="primary"
              size="lg"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get Started
            </Button3D>
            <Button3D
              variant="outlined"
              size="lg"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How It Works
            </Button3D>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="group relative rounded-none border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col items-center justify-center text-center overflow-hidden"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + stats.indexOf(stat) * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/0 to-violet-500/0 group-hover:to-violet-500/10 transition-colors duration-500" />
                <div className="text-cyan-400 mb-3 flex items-center justify-center relative z-10">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2 text-zinc-100 font-mono tracking-tight relative z-10">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 uppercase tracking-wider relative z-10">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// Made with Bob
