import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleFadeOut = () => {
      setFadeOut(true);
      setTimeout(() => {
        const loader = document.getElementById('loader-react');
        if (loader) loader.remove();
      }, 2000); // Match fade-out timing
    };

    if (document.readyState === 'complete') {
      handleFadeOut();
    } else {
      window.addEventListener('load', handleFadeOut);
      return () => window.removeEventListener('load', handleFadeOut);
    }
  }, []);

  return (
    <div
      id="loader-react"
      className={`fixed inset-0 z-[9999] flex flex-col justify-center items-center transition-opacity duration-[1700ms] ease-in-out ${
        fadeOut ? 'opacity-0 invisible' : 'opacity-100 visible'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
        animation: 'fadeIn 0.3s ease-in-out forwards',
      }}
    >
      <div className="logo-ring mb-8 flex justify-center items-center">
        <img
          src="/src/logo.png"
          alt="The Florence School Logo"
          className="w-[180px] h-[180px] object-contain drop-shadow-xl"
        />
      </div>
      <h1
        className="text-white text-2xl font-bold tracking-wide mb-1"
        style={{
          opacity: 0,
          animation: 'fadeSlide 1s ease-out 0.3s forwards',
        }}
      >
        The Florence School
      </h1>
      <p
        className="text-slate-300 text-base"
        style={{
          opacity: 0,
          animation: 'fadeSlide 1s ease-out 0.5s forwards',
        }}
      >
        Empowering Future Minds
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

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
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
        }

        body, html {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
