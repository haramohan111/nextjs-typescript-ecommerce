import { useEffect, useState } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [checkauth, setCheckauth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const verifyToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/verify`, null, { withCredentials: true });
      setCheckauth(response.data.success);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return { checkauth, isLoading };
};

export default useAuth;
