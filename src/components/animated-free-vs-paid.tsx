"use client";

import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const freeFeatures = [
  "Complete system building capabilities",
  "Full execution dashboard",
  "Comprehensive reflection tools",
  "System evolution interface",
  "Knowledge integration hub",
  "Community features",
  "Template library access",
  "Data ownership and portability",
];

const paidFeatures = [
  "AI-powered strategy development",
  "Automated pattern recognition",
  "Proactive system optimization",
  "Task management assistance",
  "Personalized reflection guidance",
  "Intelligent knowledge linking",
  "Evolving capabilities as you grow",
  "Accountability and motivation support",
];

export default function AnimatedFreeVsPaid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Background gradient animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-100 to-transparent rounded-full opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-blue-100 to-transparent rounded-full opacity-40"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -120, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Free Core Platform</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CycleGrowth provides a complete set of tools for free, with
            optional AI assistance for those who want more guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Free Forever Card */}
          <motion.div
            className="relative p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={
              isInView 
                ? { opacity: 1, x: 0, scale: 1 }
                : { opacity: 0, x: -50, scale: 0.95 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <motion.h3 
              className="text-2xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Free Forever
            </motion.h3>
            
            <ul className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView 
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <motion.div
                    className="mt-0.5 flex-shrink-0"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium w-full justify-center"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Cyclo AI Assistant Card */}
          <motion.div
            className="relative p-8 bg-gradient-to-br from-purple-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 overflow-hidden group"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={
              isInView 
                ? { opacity: 1, x: 0, scale: 1 }
                : { opacity: 0, x: 50, scale: 0.95 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -10px rgba(139, 69, 255, 0.2)",
            }}
          >
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(139, 69, 255, 0.05), rgba(59, 130, 246, 0.05))",
                  "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))",
                  "linear-gradient(45deg, rgba(99, 102, 241, 0.05), rgba(139, 69, 255, 0.05))",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.h3 
              className="text-2xl font-bold mb-6 text-gray-900 relative"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Cyclo AI Assistant
            </motion.h3>
            
            <ul className="space-y-4 mb-8">
              {paidFeatures.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView 
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <motion.div
                    className="mt-0.5 flex-shrink-0"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      filter: "hue-rotate(90deg)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5 text-purple-500" />
                  </motion.div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#pricing"
                  className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium w-full justify-center group-hover:border-purple-700 group-hover:text-purple-700"
                >
                  View Pricing Options
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    bottom: "20%",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Connection line between cards */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-gradient-to-r from-green-300 to-purple-300 -translate-x-1/2 -translate-y-1/2 hidden md:block"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isInView 
              ? { scaleX: 1, opacity: 0.5 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 1, delay: 1.8 }}
        />
      </div>
    </section>
  );
}