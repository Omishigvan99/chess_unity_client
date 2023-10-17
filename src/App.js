import React, { useEffect, useState } from "react";
import "./App.css";
import LeftPanel from "./Components/MainLayout/LeftPanel";

import RightPanel from "./Components/MainLayout/RightPanel";
import { BrowserRouter } from "react-router-dom";

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
    <BrowserRouter>
      <div className="App">
        <LeftPanel
          setOpen={setOpen}
          open={open}
          pgName={pgName}
          setPageName={setPageName}
          isAuthenticated={isAuthenticated}
        />
        <RightPanel
          setOpen={setOpen}
          open={open}
          pgName={pgName}
          setPageName={setPageName}
        />
      </div>
    </BrowserRouter>
  );
}

export default React.memo(App);
