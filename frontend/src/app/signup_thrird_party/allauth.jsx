'use client';
import { useEffect } from 'react';

export default function GoogleLoginButton() {
  const googleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };

  useEffect(() => {
    // This ensures the component is fully mounted before measuring
  }, []);

  return (
    <button onClick={googleLogin}>
      Sign in with Google
    </button>
  );
}




