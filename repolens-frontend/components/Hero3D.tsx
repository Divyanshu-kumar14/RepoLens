/**
 * Material 3D Hero Section
 * Parallax hero with animated statistics and CTAs
 */

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button3D from "./ui/Button3D";
import CodeIcon from "@mui/icons-material/Code";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
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
    { icon: <CodeIcon />, value: "100K+", label: "Lines Analyzed" },
    { icon: <SpeedIcon />, value: "<2s", label: "Query Response" },
    { icon: <SecurityIcon />, value: "100%", label: "Secure" },
    { icon: <AutoAwesomeIcon />, value: "AI", label: "Powered" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20"
      style={{ position: "relative" }}
    >
      {/* Animated Background */}
      <motion.div className="absolute inset-0 -z-10" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
            <div className="glass px-6 py-2 rounded-full inline-flex items-center gap-2 elevation-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Powered by IBM watsonx.ai Granite
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
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Chat with Your <span className="text-gradient">Codebase</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered code analysis that understands your repository. Ask
              questions, get instant answers with source references.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center items-center pt-4"
          >
            <Button3D variant="primary" size="lg">
              Get Started
            </Button3D>
            <Button3D variant="outlined" size="lg">
              View Demo
            </Button3D>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="glass rounded-2xl p-6 elevation-2 flex flex-col items-center justify-center text-center"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className="text-blue-600 dark:text-blue-400 mb-3 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
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
