import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeView from "../Views/HomeView";
import Login from "../Forms/Login";
import Signup from "../Forms/Signup";

const RightPanel = ({ open, setOpen = () => {} }) => {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />

      <Route path="/login" element={<Login open={open} setOpen={setOpen} />} />
      <Route
        path="/signup"
        element={<Signup open={open} setOpen={setOpen} />}
      />
    </Routes>
  );
};

export default RightPanel;
