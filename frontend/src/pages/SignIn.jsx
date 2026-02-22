import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData,userData} = useContext(userDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!email.includes("@") || password.length < 6) {
      setErr("Please enter a valid email and password.");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/")
    } catch (error) {
      console.error(error);
      setUserData(null)
      setLoading(false);
      const msg =
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setErr(msg);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px] text-center">
          Sign In to My <span className="text-blue-400">Virtual Assistance</span>
        </h1>

        <input
          type="email"
          placeholder="Enter Your Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && (
          <p className="text-red-400 text-[16px] font-medium text-center">
            {err}
          </p>
        )}

        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-blue-400 underline">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
