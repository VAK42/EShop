'use client'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
const ThemeContext = createContext({ toggleTheme: () => { }, mode: 'light' })
export const useThemeContext = () => useContext(ThemeContext)
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const initialized = useRef(false)
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark'
    if (stored) {
      setTimeout(() => setMode(stored), 0)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTimeout(() => setMode('dark'), 0)
    }
    initialized.current = true
  }, [])
  useEffect(() => {
    if (initialized.current) {
      localStorage.setItem('theme', mode)
      if (mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [mode])
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#8b5cf6' : '#10b981' },
      secondary: { main: mode === 'light' ? '#ec4899' : '#34d399' },
      background: { default: 'rgba(0, 0, 0, 0)', paper: 'rgba(0, 0, 0, 0)' },
      text: { primary: mode === 'light' ? '#1f2937' : '#f9fafb', secondary: mode === 'light' ? '#4b5563' : '#d1d5db' }
    },
    shape: { borderRadius: 16 },
    typography: { allVariants: { textTransform: 'capitalize', fontFamily: 'inherit' } },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: { styleOverrides: { root: { borderRadius: '12px', textTransform: 'none', fontWeight: 600 } } },
      MuiCard: { styleOverrides: { root: { borderRadius: '20px' } } }
    }
  }), [mode])
  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }
  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}