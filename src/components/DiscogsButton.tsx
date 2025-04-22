import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiDiscogs } from "react-icons/si";

const DiscogsButton: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ discogs_user: string, discogs_id: string } | null>(null);
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleLogin = () => {
    console.log(`${backendUrl}/api/v2/discogs/login`);
    window.location.href = `${backendUrl}/api/v2/discogs/login`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const discogs_id = params.get('discogs_id');
      const discogs_user = params.get('discogs_user');

      if (discogs_id && discogs_user) {
        const userData = { discogs_id, discogs_user };
        setUserData(userData);
        sessionStorage.setItem('discogsUserData', JSON.stringify(userData));
        sessionStorage.setItem('user_id', discogs_user);
        
        // Limpiar parámetros de la URL
        navigate(window.location.pathname, { replace: true });
      }
    };

    const storedData = sessionStorage.getItem('discogsUserData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      return;
    }

    checkAuth();
  }, [navigate]);

  const handleButtonClick = () => {
    if (!userData) {
      handleLogin();
    } else {
      navigate('/discogs');
    }
  };

  return (
    <div
      onClick={handleButtonClick}
      className="cursor-pointer flex items-center space-x-2 hover:text-black text-gray-400 transition-colors"
    >
      <SiDiscogs size={20} />
      <span>{userData?.discogs_user || 'Discogs'}</span>
    </div>
  );
};

export default DiscogsButton;