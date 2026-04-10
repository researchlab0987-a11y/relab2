import React, { createContext, useContext, useEffect } from 'react';
import { useTheme as useThemeData } from '../firebase/hooks';
import type { ThemeSettings } from '../types';

interface ThemeContextValue {
  theme: ThemeSettings;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useThemeData();

  // Inject CSS variables into :root whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-navbar', theme.navbarColor);
    root.style.setProperty('--color-footer', theme.footerColor);
    root.style.setProperty('--font-body', theme.fontFamily);
    root.style.setProperty('--font-heading', theme.headingFont);
    // Apply font to body
    document.body.style.fontFamily = theme.fontFamily;
    document.body.style.backgroundColor = theme.backgroundColor;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
};
