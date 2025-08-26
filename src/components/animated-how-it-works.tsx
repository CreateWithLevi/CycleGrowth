"use client";

import { motion, useInView } from "framer-motion";
import { Target, RefreshCcw, LineChart, Brain } from "lucide-react";
import { useRef } from "react";

const phases = [
  {
    icon: <Target className="w-10 h-10" />,
    title: "Plan",
    description:
      "Set clear goals, break them down into manageable tasks, and create a structured timeline for success.",
    position: "md:translate-x-[-60px] md:translate-y-[-60px]",
  },
  {
    icon: <RefreshCcw className="w-10 h-10" />,
    title: "Execute",
    description:
      "Track your progress, update task statuses, and maintain momentum throughout your growth journey.",
    position: "md:translate-x-[60px] md:translate-y-[-60px]",
  },
  {
    icon: <LineChart className="w-10 h-10" />,
    title: "Analyze",
    description:
      "Review performance data, complete structured reflection prompts, and connect new knowledge.",
    position: "md:translate-x-[-60px] md:translate-y-[60px]",
  },
  {
    icon: <Brain className="w-10 h-10" />,
    title: "Improve",
    description:
      "Review insights, adjust your system based on what you've learned, and plan your next growth cycle.",
    position: "md:translate-x-[60px] md:translate-y-[60px]",
  },
];

export default function AnimatedHowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden" ref={ref}>
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-200 rounded-full opacity-30"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">The Growth Cycle System</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cyclo guides you through four key phases of growth, creating a
            continuous improvement loop for any goal or skill.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Animated circle connector */}
          <motion.div 
            className="hidden md:block absolute top-1/2 left-1/2 w-[300px] h-[300px] -mt-[150px] -ml-[150px] border-4 border-dashed border-purple-200 rounded-full"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          />

          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                className={`p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 z-10 ${phase.position}`}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                animate={
                  isInView 
                    ? { opacity: 1, y: 0, rotateY: 0 }
                    : { opacity: 0, y: 50, rotateY: -30 }
                }
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8 + index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                  boxShadow: "0 20px 40px -10px rgba(139, 69, 255, 0.2)",
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <motion.div 
                  className="p-4 rounded-full bg-purple-100 inline-block text-purple-600 mb-4"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.icon}
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-semibold mb-3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  {phase.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  {phase.description}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Connecting lines animation */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{ zIndex: 1 }}
          >
            <motion.path
              d="M 200 150 Q 300 100 400 150"
              stroke="rgba(139, 69, 255, 0.2)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.5, delay: 1.8 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}