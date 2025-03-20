import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLastfm } from 'react-icons/fa';

const LastFMButton: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ lastfm_id: string } | null>(null);

  const handleLogin = () => {
    //const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    //window.location.href = `${backendUrl}/api/v2/lastfm/login`;
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('lastfmUserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const lastfm_id = params.get('lastfm_id');

    if (lastfm_id) {
      const userData = { lastfm_id };
      setUserData(userData);
      sessionStorage.setItem('lastfmUserData', JSON.stringify(userData));
    }
  }, []);

  const handleButtonClick = () => {
    if (!userData) {
      handleLogin();
    } else {
      navigate('/lastfm');
    }
  };

  return (
    <div
    onClick={handleButtonClick}
      className="cursor-not-allowed flex items-center space-x-2 text-gray-500"
    >
      <FaLastfm size={20} />
      <span>{userData ? userData.lastfm_id : 'LastFM'}</span>
    </div>
  );
};

export default LastFMButton;
