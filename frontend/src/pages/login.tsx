// src/pages/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  name: string;
  picture: string;
  exp: number;
}

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        console.log('✅ Decoded user:', decoded);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(decoded));

        navigate('/dashboard');
      } catch (error) {
        console.error('❌ Failed to decode token:', error);
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('❌ VITE_BACKEND_URL is not defined in .env');
      return;
    }
    console.log('🌐 Redirecting to:', `${backendUrl}/auth/google`);
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
