import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
export const userDataContext = createContext();
import axios from "axios";

function UserContext({ children }) {
  const serverUrl = "https://ai-assisst.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/users/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiRes = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/users/asktoassistant`,
        { command },
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiRes,
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
