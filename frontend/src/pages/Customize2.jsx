import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("selectedImage", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/users/update`,
        formData,
        { withCredentials: true }
      );
      setLoading(false);
      console.log(result);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5  relative">
      <MdOutlineKeyboardBackspace
        className="absolute top-7.5 left-7.5 text-white cursor-pointer hover:text-blue-200 transition-all duration-300 ease-in-out w-6 h-6"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white mb-7 text-[30px] text-center ">
        Enter your <span className="text-blue-200">Assitant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg. jarvis"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-2xl px-5 py-2.5 text-[18px]"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-75 h-14 bg-white rounded-full text-black font-semibold text-[19px] mt-5 cursor-pointer"
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          {loading ? "Loading..." : "Create Your Assistant"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
