import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import Home from './pages/Home';
import { userDataContext } from './context/userContext';

function App() {
  const { userData } = useContext(userDataContext);
  const hasAssistant = userData?.assistantImage && userData?.assistantName;

  return (
    <Routes>
      <Route path='/' element={hasAssistant ? <Home /> : <Navigate to="/customize" />} />
      <Route path='/home' element={hasAssistant ? <Home /> : <Navigate to={"/"} />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/customize" />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path='/customize' element={userData ? <Customize /> : <Navigate to="/signin" />} />
      <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
