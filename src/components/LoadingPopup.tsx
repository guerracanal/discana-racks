import React, { useEffect, useState } from 'react';
import spinner from "../assets/spinner.svg";

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
      <img src={spinner} className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" alt="Cargando"/>
        <p className="mt-4 text-sm font-semibold text-gray-300">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
