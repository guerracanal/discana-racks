import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiDiscogs } from "react-icons/si";

const DiscogsButton: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ discogs_id: string } | null>(null);

  const handleLogin = () => {
    //const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    //window.location.href = `${backendUrl}/api/v2/discogs/login`;
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('discogsUserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const discogs_id = params.get('discogs_id');

    if (discogs_id) {
      const userData = { discogs_id };
      setUserData(userData);
      sessionStorage.setItem('discogsUserData', JSON.stringify(userData));
    }
  }, []);

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
      className="cursor-not-allowed flex items-center space-x-2 text-gray-500"
    >
      <SiDiscogs size={20} />
      <span>{userData ? userData.discogs_id : 'Discogs'}</span>
    </div>
  );
};

export default DiscogsButton;
