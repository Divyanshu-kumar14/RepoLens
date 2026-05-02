/**
 * Material 3D Navigation Component
 * Floating navigation bar with 3D effects and smooth transitions
 */

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import GitHubIcon from "@mui/icons-material/GitHub";

interface Navigation3DProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export default function Navigation3D({
  onThemeToggle,
  isDarkMode,
}: Navigation3DProps) {
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [10, 20]);
  const isScrolled = useTransform(scrollY, [0, 20], [false, true]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        opacity: navOpacity,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          className="glass rounded-2xl px-6 py-4 transition-all duration-300 elevation-2"
          style={{
            backdropFilter: `blur(${navBlur}px)`,
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center elevation-3">
                <CodeIcon className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">RepoLens</h1>
                <p className="text-xs text-gray-500">Chat with Your Code</p>
              </div>
            </motion.div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#about">About</NavLink>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.a
                href="https://github.com/divyanshu-kumar14/RepoLens"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="GitHub Repository"
              >
                <GitHubIcon />
              </motion.a>

              <motion.button
                onClick={onThemeToggle}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
}

// Made with Bob
