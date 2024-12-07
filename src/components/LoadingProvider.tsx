'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoadingBar from './LoadingBar';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {}
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <LoadingBar />}
      {children}
    </LoadingContext.Provider>
  );
} 