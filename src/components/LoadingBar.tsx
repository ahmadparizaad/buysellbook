'use client';
import { useEffect, useState } from 'react';

const LoadingBar = () => {
  const [progress, setProgress] = useState(20); // Start with initial progress

  useEffect(() => {
    // Start progress immediately
    setProgress(40);

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) {
          clearInterval(timer);
          return 90;
        }
        const diff = Math.random() * 30;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    // Complete the progress when component is about to unmount
    return () => {
      clearInterval(timer);
      setProgress(100);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[9999]">
      <div 
        className="h-[2px] bg-[#FF1493] transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px #FF1493, 0 0 5px #FF1493'
        }}
      />
    </div>
  );
};

export default LoadingBar; 