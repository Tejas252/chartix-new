'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ChartLoader() {
  // Data for the animated bars
  const barData = [30, 60, 80, 45, 70, 90, 50];
  const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400', 'bg-indigo-400', 'bg-red-400'];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-64 h-48 flex items-end justify-center gap-2 mb-8">
        {barData.map((height, index) => (
          <motion.div
            key={index}
            className={`w-8 rounded-t-md ${colors[index % colors.length]}`}
            style={{ height: `${height}%` }}
            initial={{ height: 0 }}
            animate={{ 
              height: `${height}%`,
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.1
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing your data</h3>
        <p className="text-muted-foreground">Preparing beautiful visualizations for you</p>
      </motion.div>
      
      <motion.div 
        className="mt-6 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}