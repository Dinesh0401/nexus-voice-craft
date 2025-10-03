import React from "react";
import { User, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg"
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <User className="h-12 w-12" />
        </motion.div>
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-1"
          >
            Welcome back, {userName}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-primary-foreground/80"
          >
            Here's what's happening with your alumni network today
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}