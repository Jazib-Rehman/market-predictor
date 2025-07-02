"use client";
import { useAuth } from '../../../../contexts/AuthContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Portfolio Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500">Total Value</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">$124,567</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500">24h Change</p>
            <p className="text-2xl font-bold text-emerald-500">+$2,341</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500">Holdings</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center text-slate-500 dark:text-slate-400">
        <p>No holdings yet. Start by adding assets to your portfolio!</p>
      </div>
    </div>
  );
} 