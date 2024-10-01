import React, { useState } from "react";
import SidebarCoord from "../components/SidebarCoord";
import Home from "../components/Home";

const FichasCoordi = () => {
  const [sidebarToggleCoord, setsidebarToggleCoord] = useState(false);

  return (
    <div className="flex min-h-screen bg-grisClaro">
      <SidebarCoord sidebarToggleCoord={sidebarToggleCoord} />
      <div
        className={`flex flex-col flex-grow p-4 bg-grisClaro ${
          sidebarToggleCoord ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggleCoord}
          setSidebarToggle={setsidebarToggleCoord}
        />
      </div>
    </div>
  );
};

export default FichasCoordi;
