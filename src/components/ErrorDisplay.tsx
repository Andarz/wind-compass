
import React from 'react';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-900/50 rounded-lg">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
      <h2 className="mt-4 text-2xl font-bold text-red-200">An Error Occurred</h2>
      <p className="mt-2 text-red-300 font-mono">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
