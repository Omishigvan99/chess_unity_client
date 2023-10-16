// import React, { useEffect, useState } from "react";
// import "./App.css";
// import LeftPanel from "./Components/MainLayout/LeftPanel";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Components/Forms/Login";
// import Signup from "./Components/Forms/Signup";
// import RightSide from "./Components/MainLayout/RightSide";
// function App() {
//   const [open, setOpen] = useState(false);
//   const [pgName, setPageName] = useState();
//   const location = window.location.pathname;
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     setOpen(true);
//     setPageName(location);
//   }, [location]);
//   return (
//     <Router>
//       <div className="App">
//         <LeftPanel
//           setOpen={setOpen}
//           open={open}
//           pgName={pgName}
//           setPageName={setPageName}
//           isAuthenticated={isAuthenticated}
//         />
//         <RightSide />
//       </div>
//       <Routes>
//         <Route
//           path="/login"
//           element={<Login open={open} setOpen={setOpen} />}
//         />
//         <Route
//           path="/signup"
//           element={<Signup open={open} setOpen={setOpen} />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default React.memo(App);

import React, { useEffect, useState } from "react";
import "./App.css";
import LeftPanel from "./Components/MainLayout/LeftPanel";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Forms/Login";
import Signup from "./Components/Forms/Signup";
import RightSide from "./Components/MainLayout/RightSide";

function App() {
  const [open, setOpen] = useState(false);
  const [pgName, setPageName] = useState();
  const location = window.location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setOpen(true);
    setPageName(location);
  }, [location]);

  return (
    <Router>
      <div className="App">
        <LeftPanel
          setOpen={setOpen}
          open={open}
          pgName={pgName}
          setPageName={setPageName}
          isAuthenticated={isAuthenticated}
        />
        <Routes>
          <Route exact path="/home" element={<RightSide />} />

          <Route
            path="/home/login"
            element={<Login open={open} setOpen={setOpen} />}
          />
          <Route
            path="/signup"
            element={<Signup open={open} setOpen={setOpen} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default React.memo(App);
