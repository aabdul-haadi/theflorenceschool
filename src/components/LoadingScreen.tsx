import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setFadeOut(true);
      setTimeout(() => {
        const loader = document.getElementById('loader-react');
        if (loader) loader.remove();
      }, 2000); // matches fade-out duration
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div
      id="loader-react"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-[1700ms] ease-in-out ${
        fadeOut ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
      }}
    >
       <div className="logo-ring mb-8 flex items-center justify-center">
        <img
          src="/src/logo.png"
          alt="The Florence School Logo"
          className="w-[180px] max-h-[180px] object-contain"
        />
      </div> 

      <h1
        className="text-2xl font-bold text-white tracking-wide mb-1"
        style={{
          opacity: 0,
          animation: 'fadeSlide 1s ease-out 0.3s forwards',
        }}
      >
        The Florence School
      </h1>
      <p
        className="text-base text-slate-300"
        style={{
          opacity: 0,
          animation: 'fadeSlide 1s ease-out 0.5s forwards',
        }}
      >
        Empowering Future Minds
      </p>

      <style>
        {`
          @keyframes fadeSlide {
            from {
              transform: translateY(10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .logo-ring img {
            width: 180px;
            height: auto;
            max-height: 180px;
            object-fit: contain;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
