'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useModeAnimation, ThemeAnimationType } from 'react-theme-switch-animation';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize the theme animation hook
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: 500,
    isDarkMode: false, // Start with false, we'll sync manually
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  // Custom handler that triggers animation and syncs with next-themes
  const handleThemeToggle = () => {
    // Trigger the animation
    toggleSwitchTheme();
    
    // Also manually set the theme to ensure sync
    setTimeout(() => {
      setTheme(isDark ? 'light' : 'dark');
    }, 50); // Small delay to let animation start
  };

  return (
    <button
      ref={ref}
      onClick={handleThemeToggle}
      className={`p-1 transition-colors duration-200 rounded-md ${
        isDark
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-600 hover:text-black'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
