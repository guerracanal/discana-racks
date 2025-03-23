import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa';
import LoadingPopup from './LoadingPopup';

const SpotifyButton: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    spotify_id: string;
    display_name: string;
    email: string;
    access_token: string;
    expires_in: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.location.href = `${backendUrl}/api/v2/spotify/login`;
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('spotifyUserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const spotify_id = params.get('spotify_id');
    const display_name = params.get('display_name');
    const email = params.get('email') || 'No email provided';
    const access_token = params.get('access_token');
    const expires_in = params.get('expires_in');

    if (spotify_id && display_name && access_token) {
      const userData = {
        spotify_id,
        display_name,
        email,
        access_token,
        expires_in: expires_in || 'Unknown',
      };
      setUserData(userData);
      sessionStorage.setItem('spotifyUserData', JSON.stringify(userData));
      sessionStorage.setItem('user_id', spotify_id);
    }
    setIsLoading(false);
  }, []);

  const handleButtonClick = () => {
    if (!userData) {
      handleLogin();
    } else {
      navigate('/spotify');
    }
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <div
        onClick={handleButtonClick}
        className="cursor-pointer flex items-center space-x-2 text-gray-400 hover:text-[#1ED760]"
      >
        <FaSpotify size={20} />
        <span>{userData ? userData.spotify_id : 'Spotify'}</span>
      </div>
    </>
  );
};

export default SpotifyButton;
