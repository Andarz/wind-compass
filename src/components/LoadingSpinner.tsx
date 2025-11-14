
import React from 'react';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-sky-400"></div>
      <p className="mt-4 text-xl text-slate-300 font-mono">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
