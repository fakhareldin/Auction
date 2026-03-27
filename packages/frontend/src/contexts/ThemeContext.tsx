import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    direction: 'rtl',
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: '#2563eb', // Modern blue
              light: '#60a5fa',
              dark: '#1e40af',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#7c3aed', // Purple accent
              light: '#a78bfa',
              dark: '#5b21b6',
              contrastText: '#ffffff',
            },
            background: {
              default: '#f8fafc',
              paper: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#64748b',
            },
            success: {
              main: '#10b981',
              light: '#34d399',
              dark: '#059669',
            },
            error: {
              main: '#ef4444',
              light: '#f87171',
              dark: '#dc2626',
            },
            warning: {
              main: '#f59e0b',
              light: '#fbbf24',
              dark: '#d97706',
            },
            divider: '#e2e8f0',
          }
        : {
            // Dark mode colors
            primary: {
              main: '#3b82f6',
              light: '#60a5fa',
              dark: '#2563eb',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#8b5cf6',
              light: '#a78bfa',
              dark: '#7c3aed',
              contrastText: '#ffffff',
            },
            background: {
              default: '#0f172a',
              paper: '#1e293b',
            },
            text: {
              primary: '#f1f5f9',
              secondary: '#cbd5e1',
            },
            success: {
              main: '#10b981',
              light: '#34d399',
              dark: '#059669',
            },
            error: {
              main: '#ef4444',
              light: '#f87171',
              dark: '#dc2626',
            },
            warning: {
              main: '#f59e0b',
              light: '#fbbf24',
              dark: '#d97706',
            },
            divider: '#334155',
          }),
    },
    typography: {
      fontFamily: [
        'Cairo',
        'Tajawal',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      mode === 'light'
        ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
        : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
      mode === 'light'
        ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      mode === 'light'
        ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        : '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      mode === 'light'
        ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        : '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
      ...Array(20).fill(
        mode === 'light'
          ? '0 25px 50px -12px rgb(0 0 0 / 0.25)'
          : '0 25px 50px -12px rgb(0 0 0 / 0.5)'
      ),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '0.9375rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                : '0 4px 6px -1px rgb(0 0 0 / 0.3)',
            },
          },
          contained: {
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light'
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.4)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                : '0 10px 15px -3px rgb(0 0 0 / 0.3)',
              transform: 'translateY(-4px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
