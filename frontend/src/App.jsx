import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpp from "./pages/SignUpp";
import Signin from "./pages/Signin";
import Customize from "./pages/Customize";
import { userDataContext } from "./context/UserContext";
import Home from "./pages/Home";
import Customize2 from "./pages/Customize2";

function App() {
  const { userData, setUserData } = useContext(userDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUpp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/login"
        element={!userData ? <Signin /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
}

export default App;
