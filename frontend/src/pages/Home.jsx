import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);

  const synth = window.speechSynthesis;

  // ================= LOGOUT =================
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  // ================= SPEAK =================
  const speak = (text) => {
    if (!recognitionRef.current) return;

    isSpeakingRef.current = true;
    recognitionRef.current.stop(); // 🔴 stop listening

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      isSpeakingRef.current = false;
      recognitionRef.current.start(); // 🎙️ resume listening
    };

    synth.speak(utterance);
  };

  // ================= COMMAND HANDLER =================
  const handleCommand = (data) => {
    if (!data) return;

    const { type, userInput, response } = data;
    speak(response);

    const query = encodeURIComponent(userInput);

    switch (type) {
      case "google-search":
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        break;

      case "calculator-open":
        window.open(`https://www.google.com/search?q=calculator`, "_blank");
        break;

      case "instagram-open":
        window.open("https://www.instagram.com/", "_blank");
        break;

      case "facebook-open":
        window.open("https://www.facebook.com/", "_blank");
        break;

      case "weather-show":
        window.open("https://www.google.com/search?q=weather", "_blank");
        break;

      case "youtube-search":
      case "youtube-play":
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        );
        break;

      default:
        console.log("Command not recognized");
    }
  };

  // ================= SPEECH RECOGNITION =================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎙️ Speech recognition started");
    };

    recognition.onend = () => {
      if (!isSpeakingRef.current) {
        recognition.start();
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
    };

    recognition.onresult = async (e) => {
      if (isSpeakingRef.current) return; // 🛑 ignore AI speech

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      console.log("Heard:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData?.assistantName?.toLowerCase())
      ) {
        try {
          setUserText(transcript);
          setAiText("");

          const data = await getGeminiResponse(transcript);
          handleCommand(data);

          setAiText(data.response);
          setUserText("");
        } catch (err) {
          console.error("Gemini error:", err);
        }
      }
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => recognition.start())
      .catch(() => console.error("Mic permission denied"));

    return () => recognition.stop();
  }, [getGeminiResponse, userData]);

  // ================= UI =================
  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center justify-center gap-[15px]">
      <button
        onClick={handleLogOut}
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[20px] right-[20px] rounded-full text-[19px]"
      >
        Log Out
      </button>

      <button
        onClick={() => navigate("/customize")}
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full text-[19px]"
      >
        Customize Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>

      {!aiText && <img src={userImg} alt="user" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="ai" className="w-[200px]" />}
    </div>
  );
}

export default Home;
