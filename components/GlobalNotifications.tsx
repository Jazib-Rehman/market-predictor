"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import confetti from 'canvas-confetti';

export default function GlobalNotifications() {
  const [showPredictionToast, setShowPredictionToast] = useState(false);
  const [predictionData, setPredictionData] = useState<{asset: string, direction: string} | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handler = (data?: {asset: string, direction: string}) => {
      // Show confetti
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.7 },
        zIndex: 9999,
      });
      
      // Show prediction success toast
      setPredictionData(data || {asset: 'Bitcoin', direction: 'up'});
      setShowPredictionToast(true);
      
      // Hide toast after 5 seconds
      setTimeout(() => setShowPredictionToast(false), 5000);
    };
    socket.on('celebrate', handler);
    return () => {
      socket.off('celebrate', handler);
    };
  }, [socket]);

  return (
    <AnimatePresence>
      {showPredictionToast && predictionData && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: 90 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -100, x: 100 }}
          className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"
        >
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Prediction Correct! 🎉</p>
            <p className="text-sm">{predictionData.asset} moved {predictionData.direction} as predicted</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 