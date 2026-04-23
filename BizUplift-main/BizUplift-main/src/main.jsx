import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// NOTE: Please replace this placeholder with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "230599625512-vu6m52o9nkftasdlpnm6u5nhcu0daoag.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
