import React, { useEffect, useState } from 'react';

interface LoadingPopupProps {
  isLoading: boolean;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ isLoading }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setVisible(true); // Show immediately when isLoading is true
    } else {
      timeout = setTimeout(() => setVisible(false), 300); // Delay hiding
    }

    return () => clearTimeout(timeout); // Clear timeout on unmount
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 bg-opacity-90 rounded-lg p-6 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 animate-spin text-gray-400"
          viewBox="0 0 64 64"
        >
          <g transform="rotate(-10 32 32)">
            <rect
              x="12"
              y="10"
              width="40"
              height="44"
              rx="6"
              ry="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </g>
          <g>
            <circle
              cx="32"
              cy="32"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M32 22 a10 10 0 0 1 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M32 24 a8 8 0 0 1 0 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle
              cx="32"
              cy="32"
              r="3"
              fill="currentColor"
              stroke="none"
            />
          </g>
        </svg>
        <p className="mt-4 text-sm font-semibold text-gray-300">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
