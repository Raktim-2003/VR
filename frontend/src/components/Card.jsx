import React from 'react';
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';

function Card({ image }) {
    const {
      serverUrl,
      userData,
      setUserData,
      frontendImage,
      setFrontendImage,
      backendImage,
      setBackendImage,
      selectedImage,
      setSelectedImage,
    } = useContext(userDataContext);
  return (
    <div
      className={ `w-[70px] h-[140px] lg:w-[150px]  lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden cursor-pointer 
                 transition-all duration-500 ease-in-out transform 
                 hover:scale-110 hover:border-blue-500 hover:shadow-[0_0_25px_#3b82f6]  ${selectedImage==image ?  "border-4 border-white shadow-[0_0_25px_#3b82f6]" : null}`} onClick={() => {setSelectedImage(image)
                  setBackendImage(null)
                  setFrontendImage(null)

                 }}
    >
      <img src={image} className='h-full w-full object-cover' />
    </div>
  );
}

export default Card;
