"use client";

import { motion, useInView } from "framer-motion";
import { Target, RefreshCcw, Brain, LineChart, Layers, Sparkles } from "lucide-react";
import { useRef } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

const features = [
  {
    title: "System Builder",
    description:
      "Create customized templates for your personal growth frameworks across multiple domains.",
    icon: Target,
    color: "purple",
  },
  {
    title: "Execution Tracker",
    description:
      "Manage tasks, visualize timelines, and track milestones to maintain momentum.",
    icon: RefreshCcw,
    color: "blue",
  },
  {
    title: "Reflection Tools",
    description:
      "Structured analysis prompts and knowledge linking capabilities to maximize learning.",
    icon: Brain,
    color: "green",
  },
  {
    title: "Progress Analytics",
    description:
      "Visualize your growth journey with beautiful charts and insightful metrics.",
    icon: LineChart,
    color: "yellow",
  },
  {
    title: "Knowledge Integration",
    description:
      "Connect insights across different domains with a Zettelkasten-inspired linking system.",
    icon: Layers,
    color: "red",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Receive intelligent recommendations based on your unique patterns and progress.",
    icon: Sparkles,
    color: "indigo",
  },
];

const colorMap = {
  purple: { bg: "bg-purple-100", text: "text-purple-600", glow: "rgba(139, 69, 255, 0.3)" },
  blue: { bg: "bg-blue-100", text: "text-blue-600", glow: "rgba(59, 130, 246, 0.3)" },
  green: { bg: "bg-green-100", text: "text-green-600", glow: "rgba(34, 197, 94, 0.3)" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", glow: "rgba(251, 191, 36, 0.3)" },
  red: { bg: "bg-red-100", text: "text-red-600", glow: "rgba(239, 68, 68, 0.3)" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", glow: "rgba(99, 102, 241, 0.3)" },
};

export default function AnimatedFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Subtle Paper Shaders Background */}
      <div className="absolute inset-0">
        <MeshGradient
          colors={['#f8fafc', '#e2e8f0', '#f1f5f9', '#ffffff']}
          distortion={0.3}
          swirl={0.2}
          speed={0.05}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.8,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white/60 to-gray-50/80" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Powerful Growth Tools</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CycleGrowth provides everything you need to design, track, and
            optimize your personal growth systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];
            
            return (
              <motion.div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  isInView 
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: `0 20px 40px -10px ${colors.glow}`,
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Animated icon container */}
                <motion.div 
                  className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center mb-4 mx-auto`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: index * 0.3,
                    }}
                  >
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </motion.div>
                </motion.div>

                <motion.h3 
                  className="text-xl font-semibold mb-2 text-center group-hover:text-gray-900 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 text-center group-hover:text-gray-700 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  {feature.description}
                </motion.p>

                {/* Subtle glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 border-2 border-purple-200 rotate-45"
              animate={{
                x: [0, 20, 0],
                y: [0, -30, 0],
                rotate: [45, 135, 45],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
              style={{
                right: `${10 + i * 20}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}