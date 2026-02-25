import { getAuth } from "firebase/auth";
import { useState } from "react";

const useAuthFetch = () => {
  const [error, setError] = useState(null);
  const auth = getAuth();

  const requestWithAuth = async (url, method, body = null) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      // use firebase id token as auth bearer for api calls
      const token = await user.getIdToken();
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
           `Request failed: ${response.status} ${errorData.message}`
        );
      }

      const data = await response.json();
      setError(null);
      return data;
    } 
    
    catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return { requestWithAuth, error };
};

export default useAuthFetch;