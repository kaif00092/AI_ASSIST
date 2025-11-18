import React, { useContext, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { BiMenuAltRight } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
function Home() {
  const { userData, serverUrl, setUserData, getGeminiRes } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const isSpeakngRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const handleLogout = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakngRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition started");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.log("start error", error);
        }
      }
    }
  };

  const speak = (text) => {
    if (!synth || typeof synth.speak !== "function") {
      console.warn("SpeechSynthesis not supported in this browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    } else {
      console.warn("No Hindi voice found.");
    }
    isSpeakngRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakngRef.current = false;
      // Delay restart slightly and guard with try/catch to avoid InvalidStateError
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator_open") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "youtube_search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
    // if (type === "youtube_search" || type === "youtube_play") {
    //   const query = encodeURIComponent(userInput);
    //   window.open(`https://www.youtube.com/watch?v=${query}`, "_blank");
    // }
    if (type === "instagram_open") {
      window.open("https://www.instagram.com/", "_blank");
    }
    if (type === "facebook_open") {
      window.open("https://www.facebook.com/", "_blank");
    }
    if (type === "twitter_open") {
      window.open("https://www.twitter.com/", "_blank");
    }
    if (type === "linkedin_open") {
      window.open("https://www.linkedin.com/", "_blank");
    }
    if (type === "github_open") {
      window.open("https://www.github.com/", "_blank");
    }
    if (type === "reddit_open") {
      window.open("https://www.reddit.com/", "_blank");
    }
    if (type === "whatsapp_open") {
      window.open("https://web.whatsapp.com/", "_blank");
    }
    if (type === "gmail_open") {
      window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
  };
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    // stable settings
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isRecognizingRef.current && !isSpeakngRef.current) {
        try {
          recognition.start();
          console.log("Recognition started");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log("start error", error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      console.log(" Recogniton Started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakngRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition started");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log("start error", error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      // Ignore noisy 'no-speech' events and restart quietly
      console.warn("recognition error", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakngRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition started after");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log("start error", error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard :" + transcript);
      // If userData or assistantName isn't ready yet, ignore the result
      if (!userData || !userData.assistantName) return;

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiRes(transcript);

        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };
    // const fallback = setInterval(() => {
    //   if (!isRecognizingRef.current && !isSpeakngRef.current) {
    //     safeRecognition();
    //   }
    // }, 10000);
    // safeRecognition();

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name},what can i help you with?`
    );
    greeting.lang = "hi-IN";

    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);
  return (
    <div className="w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-4 overflow-hidden">
      <BiMenuAltRight
        className="lg:hidden text-white absolute top-5 right-5 w-7 h-7"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute  top-0 w-full h-full bg-[#00000000] backdrop-blur-lg p-5 flex flex-col gap-6 items-start ${
          ham ? "translate-x-0" : "-translate-x-full"
        } transition-transform cursor-pointer`}
      >
        <RxCross2
          className=" text-white absolute top-5 right-5 w-7 h-7 cursor-pointer"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-38 h-14 bg-white rounded-full text-black font-semibold text-[19px]    cursor-pointer "
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className="min-w-38 h-14 bg-white rounded-full text-black font-semibold text-[19px]   px-5 py-2.5 cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          Customize your AI Assistant
        </button>
        <div className="w-full h-0.5 bg-gray-400"></div>
        <h1 className="text-white text-[18px] font-semibold ">History</h1>
        <div className="w-full h-[60%] overflow-y-auto flex flex-col gap-5">
          {userData.history?.map((his) => {
            <span className="text-gray-400 text-[18px] truncate ">{his}</span>;
          })}
        </div>
      </div>
      <button
        className="min-w-38 h-14 bg-white rounded-full text-black font-semibold text-[19px] mt-5 absolute hidden   lg:block top-5 right-5 cursor-pointer "
        onClick={handleLogout}
      >
        Log Out
      </button>
      <button
        className="min-w-38 h-14 bg-white rounded-full text-black font-semibold text-[19px] mt-5 absolute hidden  lg:block top-25 right-5 px-5 py-2.5 cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize your AI Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="object-cover h-full"
        />
      </div>
      <h1 className="text-white text-[18px] font-semibold ">
        I'm {userData?.assistantName}
      </h1>

      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={ai} alt="" className="w-[200px]" />}

      <h1 className="text-white">
        {userText ? userText : aiText ? aiText : "Say something..."}
      </h1>
    </div>
  );
}

export default Home;
