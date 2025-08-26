"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, RefreshCcw, Check } from "lucide-react";
import Link from "next/link";

export default function AnimatedHero() {
  return (
    <div className="container mx-auto px-4 relative">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <motion.h1 
            className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Meet{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Cyclo
            </span>
            , Your Growth Evolution Assistant
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Navigate your personal growth journey with an AI assistant that
            evolves as you do, guiding you through cycles of planning,
            execution, analysis, and improvement.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(139, 69, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                Start Your Growth Cycle
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg"
            >
              <Link
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 text-gray-200 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-lg font-medium"
              >
                How It Works
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            {[
              "Free core platform",
              "Evolving AI assistant", 
              "Complete data ownership"
            ].map((feature, index) => (
              <motion.div 
                key={feature}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.1, type: "spring" }}
                >
                  <Check className="w-5 h-5 text-purple-400" />
                </motion.div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <motion.div 
            className="relative w-[320px] h-[320px] mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-20"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div 
              className="absolute inset-8 rounded-full bg-white shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -10px rgba(139, 69, 255, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCcw className="h-20 w-20 text-white" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-lg"
              animate={{ 
                rotate: [0, 10, -10, 0],
                y: [0, -2, 2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCcw className="w-6 h-6 text-purple-600" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}