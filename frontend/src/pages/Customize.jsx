import React, { useContext, useRef } from "react";
import { RiImageAddLine } from "react-icons/ri";
import Card from "../components/Card";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage("input");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center p-5">
      <MdKeyboardBackspace  className=" absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]  cursor-pointer" onClick={()=>navigate("/")}/>
      <h1 className="text-white text-3xl mb-10 text-center">
        Select Your <span className="text-purple-500">Assistant Image</span>
      </h1>

      <div className="flex flex-wrap gap-4 justify-center max-w-[900px]">
        {[image1, image2, image3, image4, image5, image6, image7].map((img, index) => (
          <Card key={index} image={img} />
        ))}

        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 rounded-2xl flex items-center justify-center cursor-pointer
            ${selectedImage === "input" ? "border-white shadow-[0_0_25px_#3b82f6] border-4" : "border-[#0000ff66] hover:border-blue-500 hover:shadow-[0_0_25px_#3b82f6]"}`}
          onClick={() => {
            inputImage.current.click();
          }}
        >
          {!frontendImage ? (
            <RiImageAddLine className="text-white w-6 h-6" />
          ) : (
            <img src={frontendImage} alt="preview" className="h-full object-cover" />
          )}
        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      </div>

      {selectedImage && (
        <button
          className="mt-8 bg-white text-black px-6 py-3 rounded-full font-semibold"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
