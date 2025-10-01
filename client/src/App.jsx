import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Components/Navbar";
import Sidenav from "./Components/Sidebar";
// Redux store and persist
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { ToastContainer } from "react-toastify";

axios.defaults.withCredentials = true;

const MainApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wideScreen, setWideScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => {
      const isWide = window.innerWidth >= 1024;
      setWideScreen(isWide);
      if (!isWide) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <div className="flex">
          <Topbar onSidebarToggle={handleSidebarToggle} />
          <div className="flex flex-1">
            {sidebarOpen && (
              <Sidenav open={sidebarOpen} largeScreen={wideScreen} />
            )}
            <div
              className={`flex-1 transition-all duration-300 ${
                sidebarOpen && wideScreen ? "ml-64" : "ml-0"
              }`}
            >
              <div className="flex-1 overflow-y-auto p-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default MainApp;
