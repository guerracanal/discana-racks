import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLastfm } from 'react-icons/fa';
import LoadingPopup from './LoadingPopup'; // Import LoadingPopup


const LastFMButton: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ lastfm_user: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleLogin = () => {
    window.location.href = `${backendUrl}/api/v2/lastfm/login`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true); // Set loading to true before checking auth
      const params = new URLSearchParams(window.location.search);
      const lastfm_user = params.get('lastfm_user');      

      if (lastfm_user) {
        const userData = { lastfm_user };
        setUserData(userData);
        sessionStorage.setItem('lastfmUserData', JSON.stringify(userData));
        sessionStorage.setItem('user_id', lastfm_user);        
        navigate(window.location.pathname, { replace: true });
      }
      setIsLoading(false); // Set loading to false after checking auth
    };

    const storedData = sessionStorage.getItem('lastfmUserData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setIsLoading(false); // Set loading to false if data is already stored
      return;
    }

    checkAuth();
  }, [navigate]);

  const handleButtonClick = () => {
    if (!userData) {
      handleLogin();
    } else {
      navigate('/lastfm');
    }
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} /> {/* Conditionally render LoadingPopup */}
      <div
        onClick={handleButtonClick}
        className="cursor-pointer flex items-center space-x-2 text-gray-400 hover:text-red-600 transition-colors"
      >
        <FaLastfm size={20} />
        <span>{userData?.lastfm_user || 'Last.fm'}</span>
      </div>
    </>
  );
};

export default LastFMButton;