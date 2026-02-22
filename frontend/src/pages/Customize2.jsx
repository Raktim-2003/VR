import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
  const context = useContext(userDataContext);
  const navigate = useNavigate();

  if (!context || !context.userData || !context.serverUrl) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white bg-black">
        <p>
          Session expired. Please <a href="/login" className="underline text-blue-400">login</a> again.
        </p>
      </div>
    );
  }

  const { userData, backendImage, selectedImage, serverUrl, setUserData } = context;
  const [assistantName, setAssistantName] = useState(userData.assistantName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) formData.append("assistantImage", backendImage);
      else if (selectedImage) formData.append("imageUrl", selectedImage);

      const res = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
      });

      setUserData(res.data);
      navigate("/home");
    } catch (error) {
      console.error("Update Error", error);
      alert("Failed to update assistant.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center p-5 relative">
      <MdKeyboardBackspace  className=" absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]  cursor-pointer" onClick={()=>navigate("/customize")}/>
      <h1 className="text-white text-3xl mb-10 text-center">
        Enter Your <span className="text-purple-500">Assistant Name</span>
      </h1>

      <input
        type="text"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        placeholder="Enter Assistant Name"
        className="w-full max-w-[600px] h-[60px] text-white bg-transparent border-2 border-white px-5 rounded-full placeholder-gray-400"
      />

      {assistantName && (
        <button
          onClick={handleUpdateAssistant}
          className="mt-8 min-w-[300px] h-[60px] bg-white text-black font-semibold rounded-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
