// GoogleAuth.jsx
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { googleAuth } from '../store/slices/authSlice';


export default function GoogleAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.warn('Google SDK not loaded yet');
      return;
    }

    // Only initialize once
    window.google.accounts.id.initialize({
      client_id:import.meta.env.VITE_Google_Client_ID,
      callback: handleCredentialResponse,
    });

    // ✅ Use a div to render a proper button — avoids FedCM prompt spam
    window.google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large' }
    );

    // ❌ Avoid calling prompt() here unless really needed
     window.google.accounts.id.prompt();
  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
const data = {
  idToken
}
    await dispatch(googleAuth(data));
  };

  return <div id="google-btn">
  </div>;
}
