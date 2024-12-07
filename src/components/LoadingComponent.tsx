const LoadingComponent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Outer circle */}
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Middle circle */}
        <div className="absolute inset-2 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
        
        {/* Inner circle */}
        <div className="absolute inset-4 border-4 border-t-transparent border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium text-blue-500 animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingComponent; 