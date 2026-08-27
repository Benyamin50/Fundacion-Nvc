import { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  let timeoutId = null;
  let navigateTimeoutId = null;

  const showLoading = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setIsLoading(true);
    
    timeoutId = setTimeout(() => {
      setIsLoading(false);
      timeoutId = null;
    }, 5000);
  };

  const hideLoading = () => {
    setIsLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const navigateWithLoading = (navigate, path, delay = 500) => {
    showLoading();
    
    if (navigateTimeoutId) {
      clearTimeout(navigateTimeoutId);
      navigateTimeoutId = null;
    }
    
    navigateTimeoutId = setTimeout(() => {
      navigate(path);
      navigateTimeoutId = null;
    }, delay);
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      showLoading, 
      hideLoading,
      navigateWithLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}