import { useState } from "react";

const useHttp = (requestConfig, applyData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : 'GET',
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        }
      );
  
      if (!response.ok) {
        throw new Error("Request failed!");
      }
  
      const responseData = await response.json();
      applyData(responseData);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    
    setIsLoading(false);
  };

  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest
  }
};

export default useHttp;
