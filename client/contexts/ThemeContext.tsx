import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
  themeColor: string;
  setThemeColor: (color: string) => void;
  applyThemeColor: (color: string) => void;
}

const themeColorPalettes: Record<string, { light: ThemeColors; dark: ThemeColors }> = {
  blue: {
    light: {
      primary: '213 94% 68%',
      primaryForeground: '213 31% 12%',
      secondary: '213 27% 84%',
      secondaryForeground: '213 31% 12%',
      accent: '213 27% 84%',
      accentForeground: '213 31% 12%',
      muted: '213 27% 94%',
      mutedForeground: '213 19% 46%',
    },
    dark: {
      primary: '213 94% 68%',
      primaryForeground: '213 31% 12%',
      secondary: '213 31% 16%',
      secondaryForeground: '213 27% 94%',
      accent: '213 31% 16%',
      accentForeground: '213 27% 94%',
      muted: '213 31% 16%',
      mutedForeground: '213 19% 65%',
    }
  },
  red: {
    light: {
      primary: '0 84% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '0 60% 94%',
      secondaryForeground: '0 84% 15%',
      accent: '0 60% 94%',
      accentForeground: '0 84% 15%',
      muted: '0 60% 96%',
      mutedForeground: '0 19% 46%',
    },
    dark: {
      primary: '0 84% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '0 31% 16%',
      secondaryForeground: '0 27% 94%',
      accent: '0 31% 16%',
      accentForeground: '0 27% 94%',
      muted: '0 31% 16%',
      mutedForeground: '0 19% 65%',
    }
  },
  green: {
    light: {
      primary: '142 76% 36%',
      primaryForeground: '0 0% 98%',
      secondary: '142 60% 94%',
      secondaryForeground: '142 84% 15%',
      accent: '142 60% 94%',
      accentForeground: '142 84% 15%',
      muted: '142 60% 96%',
      mutedForeground: '142 19% 46%',
    },
    dark: {
      primary: '142 76% 36%',
      primaryForeground: '0 0% 98%',
      secondary: '142 31% 16%',
      secondaryForeground: '142 27% 94%',
      accent: '142 31% 16%',
      accentForeground: '142 27% 94%',
      muted: '142 31% 16%',
      mutedForeground: '142 19% 65%',
    }
  },
  purple: {
    light: {
      primary: '262 83% 58%',
      primaryForeground: '0 0% 98%',
      secondary: '262 60% 94%',
      secondaryForeground: '262 84% 15%',
      accent: '262 60% 94%',
      accentForeground: '262 84% 15%',
      muted: '262 60% 96%',
      mutedForeground: '262 19% 46%',
    },
    dark: {
      primary: '262 83% 58%',
      primaryForeground: '0 0% 98%',
      secondary: '262 31% 16%',
      secondaryForeground: '262 27% 94%',
      accent: '262 31% 16%',
      accentForeground: '262 27% 94%',
      muted: '262 31% 16%',
      mutedForeground: '262 19% 65%',
    }
  },
  orange: {
    light: {
      primary: '25 95% 53%',
      primaryForeground: '0 0% 98%',
      secondary: '25 60% 94%',
      secondaryForeground: '25 84% 15%',
      accent: '25 60% 94%',
      accentForeground: '25 84% 15%',
      muted: '25 60% 96%',
      mutedForeground: '25 19% 46%',
    },
    dark: {
      primary: '25 95% 53%',
      primaryForeground: '0 0% 98%',
      secondary: '25 31% 16%',
      secondaryForeground: '25 27% 94%',
      accent: '25 31% 16%',
      accentForeground: '25 27% 94%',
      muted: '25 31% 16%',
      mutedForeground: '25 19% 65%',
    }
  },
  pink: {
    light: {
      primary: '330 81% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '330 60% 94%',
      secondaryForeground: '330 84% 15%',
      accent: '330 60% 94%',
      accentForeground: '330 84% 15%',
      muted: '330 60% 96%',
      mutedForeground: '330 19% 46%',
    },
    dark: {
      primary: '330 81% 60%',
      primaryForeground: '0 0% 98%',
      secondary: '330 31% 16%',
      secondaryForeground: '330 27% 94%',
      accent: '330 31% 16%',
      accentForeground: '330 27% 94%',
      muted: '330 31% 16%',
      mutedForeground: '330 19% 65%',
    }
  },
  emerald: {
    light: {
      primary: '160 84% 39%',
      primaryForeground: '0 0% 98%',
      secondary: '160 60% 94%',
      secondaryForeground: '160 84% 15%',
      accent: '160 60% 94%',
      accentForeground: '160 84% 15%',
      muted: '160 60% 96%',
      mutedForeground: '160 19% 46%',
    },
    dark: {
      primary: '160 84% 39%',
      primaryForeground: '0 0% 98%',
      secondary: '160 31% 16%',
      secondaryForeground: '160 27% 94%',
      accent: '160 31% 16%',
      accentForeground: '160 27% 94%',
      muted: '160 31% 16%',
      mutedForeground: '160 19% 65%',
    }
  },
  indigo: {
    light: {
      primary: '239 84% 67%',
      primaryForeground: '0 0% 98%',
      secondary: '239 60% 94%',
      secondaryForeground: '239 84% 15%',
      accent: '239 60% 94%',
      accentForeground: '239 84% 15%',
      muted: '239 60% 96%',
      mutedForeground: '239 19% 46%',
    },
    dark: {
      primary: '239 84% 67%',
      primaryForeground: '0 0% 98%',
      secondary: '239 31% 16%',
      secondaryForeground: '239 27% 94%',
      accent: '239 31% 16%',
      accentForeground: '239 27% 94%',
      muted: '239 31% 16%',
      mutedForeground: '239 19% 65%',
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('skytrack_theme');
    return (savedTheme as Theme) || 'light';
  });

  const [themeColor, setThemeColor] = useState<string>(() => {
    const savedColor = localStorage.getItem('skytrack_theme_color');
    return savedColor || 'blue';
  });

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light');

  const applyThemeColor = (color: string) => {
    const root = document.documentElement;
    const palette = themeColorPalettes[color];
    
    if (!palette) return;

    const colors = actualTheme === 'dark' ? palette.dark : palette.light;

    // Apply the color variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);

    // Update sidebar colors to match
    root.style.setProperty('--sidebar-primary', colors.primary);
    root.style.setProperty('--sidebar-primary-foreground', colors.primaryForeground);
    root.style.setProperty('--sidebar-accent', colors.accent);
    root.style.setProperty('--sidebar-accent-foreground', colors.accentForeground);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    const updateTheme = () => {
      root.classList.remove('light', 'dark');
      
      let resolvedTheme: 'dark' | 'light';
      
      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolvedTheme = theme;
      }
      
      root.classList.add(resolvedTheme);
      setActualTheme(resolvedTheme);
      
      // Apply theme color after theme is set
      applyThemeColor(themeColor);
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, themeColor, actualTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('skytrack_theme', newTheme);
  };

  const handleSetThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('skytrack_theme_color', color);
    applyThemeColor(color);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
    themeColor,
    setThemeColor: handleSetThemeColor,
    applyThemeColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
