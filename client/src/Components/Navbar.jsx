import { useEffect, useRef, useState } from "react";

// importing icons from Material UI
import {
  Menu as MenuIcon,
  NotificationsNone as BellIcon,
  Search as MagnifierIcon,
  Mic as MicrophoneIcon,
  VideoCallOutlined as UploadIcon,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/userSlice";
import VideoUpload from "./VideoUpload";
import defaultAvatar from "../assets/channels4_profile.jpg"; // default profile image

const Topbar = ({ onSidebarToggle }) => {
  const [showUpload, setShowUpload] = useState(false); // for upload popup
  const [searchInput, setSearchInput] = useState(""); // for search bar input value
  const [dropdownVisible, setDropdownVisible] = useState(false); // for show or hide user dropdown menu

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectCurrentUser = (state) => state.user.currentUser;
  const userLoggedIn = useSelector(selectCurrentUser); // renamed variable and used selector helper

  // this runs when component mounts
  useEffect(() => {
    // Token is now handled via cookies automatically by axios
    // No need to manually manage localStorage tokens
  }, []);

  // handles clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout function
  const handleLogout = () => {
    dispatch(signOut());
    setDropdownVisible(false);
    navigate("/");
  };

  return (
    <>
      {/* top navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9f9] border-b border-gray-200 px-4 sm:px-6 py-2 flex items-center justify-between h-16">
        {/* menu icon + logo */}
        <div className="flex items-center gap-4">
          <button onClick={onSidebarToggle}>
            <MenuIcon className="text-2xl cursor-pointer" />
          </button>
          <Link
            to="/"
            className="flex items-center gap-1 text-[22px] font-bold text-black tracking-wide"
          >
            VibeTube
            <span className="ml-1 w-3 h-3 bg-red-600 rounded-full inline-block"></span>
          </Link>
        </div>

        {/* search bar  */}
        <div className="hidden sm:flex items-center w-[35%]">
          <div className="flex w-full border border-gray-300 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search"
              aria-label="Search videos"
              className="flex-1 px-4 py-2 text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?q=${searchInput}`);
                }
              }}
            />
            <button
              className="px-4 py-2 bg-gray-100 border-l border-gray-300 hover:bg-gray-200"
              onClick={() => navigate(`/search?q=${searchInput}`)}
              aria-label="Search"
            >
              <MagnifierIcon />
            </button>
          </div>
          <button
            className="ml-3 text-2xl cursor-pointer hover:text-red-600"
            aria-label="Voice search"
          >
            <MicrophoneIcon />
          </button>
        </div>

        {/* upload, notification, and user profile and sign in */}
        <div className="flex items-center gap-5">
          <Link to="/upload">
            <UploadIcon className="text-2xl cursor-pointer hover:text-red-600" />
          </Link>

          <BellIcon className="text-2xl cursor-pointer hover:text-red-600" />

          {/* if user is logged in, show profile image and dropdown */}
          {userLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Username display on the left side */}
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-700">
                  {userLoggedIn.name}
                </span>
              </div>

              <div className="relative">
                <img
                  src={userLoggedIn.img || defaultAvatar} // use user image or default pic
                  alt="user avatar"
                  onClick={() => setDropdownVisible(!dropdownVisible)} // toggle dropdown
                  className="w-9 h-9 rounded-full object-cover border cursor-pointer shadow hover:ring-2 hover:ring-red-500 transition"
                />

                {/* dropdown menu */}
                {dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {/* Profile Button */}
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 text-left rounded-t-lg"
                    >
                      Your Channel
                    </button>

                    <div className="border-t border-gray-100" />

                    {/* Sign Out Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 text-left rounded-b-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // if not logged in, show sign in buttoon (requirement from internshala)
            <Link to="/signin">
              <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-md">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </nav>

      {showUpload && <VideoUpload setOpen={setShowUpload} />}
    </>
  );
};

export default Topbar;
