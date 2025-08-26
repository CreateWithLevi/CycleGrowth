"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

export default function AnimatedCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      {/* Premium MeshGradient Background */}
      <div className="absolute inset-0">
        <MeshGradient
          colors={['#f8fafc', '#e2e8f0', '#ddd6fe', '#fdf4ff']}
          distortion={0.4}
          swirl={0.3}
          speed={0.08}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.9,
          }}
        />
        {/* Gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/60 to-blue-50/80" />
      </div>

      <div className="container mx-auto px-4 text-center relative">
        {/* Floating elements around the CTA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${20 + ((i % 4) * 20)}%`,
              }}
            />
          ))}
        </div>

        <motion.h2 
          className="text-3xl font-bold mb-4 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Ready to Start Your Growth Journey?
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join thousands of users who are transforming their lives with
          CycleGrowth's structured approach and Cyclo's guidance.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={
            isInView 
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 20, scale: 0.9 }
          }
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.08,
              boxShadow: "0 25px 50px -10px rgba(139, 69, 255, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Begin Your First Cycle
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Radial glow effect behind button */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Success indicators */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Free to start</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>No credit card required</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Start building today</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}