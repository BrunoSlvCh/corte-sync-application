import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className:
              '!bg-white !text-slate-900 !border !border-slate-200 dark:!bg-slate-800 dark:!text-slate-50 dark:!border-slate-700 !text-sm',
            success: { iconTheme: { primary: '#2563EB', secondary: '#FFFFFF' } },
            error: { iconTheme: { primary: '#E11D48', secondary: '#FFFFFF' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
