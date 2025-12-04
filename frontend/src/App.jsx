import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar user={user} />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
