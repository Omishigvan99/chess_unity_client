import React, { useEffect, useState } from "react";
import "./App.css";
import ChessBoard from "./Components/ChessBoard";
import LeftPanel from "./Components/LeftPanel";
import Blackbg from "./Styles/Blackbg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Forms/Login";
import Guest from "./Components/Forms/Guest";
import Signup from "./Components/Forms/Signup";
import RightPanel from "./Components/RightPanel";

function App() {
  const [open, setOpen] = useState(false);
  const [pgName, setPageName] = useState();
  const location = window.location.pathname;

  useEffect(() => {
    setOpen(true);
    setPageName(location);
  }, [location]);
  return (
    <Router>
      <div className="App">
        <Blackbg open={open} pgName={pgName} setOpen={setOpen} />

        <LeftPanel
          setOpen={setOpen}
          open={open}
          pgName={pgName}
          setPageName={setPageName}
        />

        <div className="right-pannel">
          <ChessBoard
            FEN={
              "r1bqk1nr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 5"
            }
          />
          <RightPanel />
        </div>
      </div>
      <Routes>
        <Route
          path="/login"
          element={<Login open={open} setOpen={setOpen} />}
        />
        <Route
          path="/signup"
          element={<Signup open={open} setOpen={setOpen} />}
        />
        <Route
          exact
          path="/guest"
          element={<Guest open={open} setOpen={setOpen} />}
        />
      </Routes>
    </Router>
  );
}

export default React.memo(App);
