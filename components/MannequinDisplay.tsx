import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Dressing the mannequin...",
    "Applying the latest fashion...",
    "Styling with AI magic...",
    "This can take a moment...",
    "Getting the perfect fit...",
    "Almost ready for the runway..."
];

const Loader: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex flex-col items-center justify-center z-10 p-4 text-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-indigo-800 dark:text-indigo-300 font-semibold text-lg transition-opacity duration-500">{message}</p>
        </div>
    );
};


interface MannequinDisplayProps {
  imageUrl: string;
  isLoading: boolean;
}

const MannequinDisplay: React.FC<MannequinDisplayProps> = ({ imageUrl, isLoading }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-inner overflow-hidden">
      {isLoading && <Loader />}
      <img
        src={imageUrl}
        alt="Mannequin"
        className="object-contain max-w-full max-h-full h-full transition-opacity duration-500"
        style={{ opacity: isLoading ? 0.5 : 1 }}
      />
    </div>
  );
};

export default MannequinDisplay;
