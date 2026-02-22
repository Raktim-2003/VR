import axios from "axios";
import React, { useEffect, useState, createContext } from "react";


export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch the current user
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current User:", result.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Get response from Gemini assistant
  const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      {command },
      {withCredentials: true,});
    return result.data;
  } catch (error) {
    console.error("Gemini error:", error);
    return null;
  }
};


  // Run once on mount to get current user
  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
