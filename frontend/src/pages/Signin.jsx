import React from "react";
import bg from "../assets/authBg.png";
import { IoEyeSharp } from "react-icons/io5";
import { HiMiniEyeSlash } from "react-icons/hi2";
import axios, { formToJSON } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log("Error in axios", error);
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#0000003e] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-6 px-5 rounded-2xl"
        onSubmit={handleSignIn}
      >
        <h1
          className="text-white text-3xl
        font-bold mb-5"
        >
          Sign In to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-2xl px-5 py-2.5 text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white rounded-2xl text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="w-full h-full outline-none  bg-transparent text-white placeholder-gray-300 rounded-2xl px-5 py-2.5 text-[18px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <IoEyeSharp
              className="absolute top-4.5 right-5 text-[white]  w-[25px] h-[25px]"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          {showPassword && (
            <HiMiniEyeSlash
              className="absolute top-4.5 right-5 text-[white]  w-[25px] h-[25px]"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          )}
        </div>
        {err.length > 0 && <p className="text-red-600">*{err}</p>}
        <button
          className="min-w-38 h-14 bg-white rounded-full text-black font-semibold text-[19px] mt-5"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <p
          className="text-white text-[18px] cursor-pointer "
          onClick={() => {
            navigate("/signup");
          }}
        >
          Want to create a new accout ?
          <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Signin;
