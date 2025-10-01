import {
  HomeOutlined,
  SubscriptionsOutlined,
  VideoLibraryOutlined,
  PersonOutline,
  ChevronRight,
  MusicNoteOutlined,
  StorefrontOutlined,
  LiveTvOutlined,
  SportsEsportsOutlined,
  HistoryOutlined,
  PlaylistPlayOutlined,
  WhatshotOutlined,
  MovieOutlined,
  SettingsOutlined,
  FlagOutlined,
  HelpOutline,
  FeedbackOutlined,
  SmartDisplayOutlined,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidenav = ({ open, largeScreen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  // Menu list for main navigationns
  const mainMenu = [
    { id: 1, label: "Home", icon: <HomeOutlined />, route: "/" },
    {
      id: 2,
      label: "Your Channel",
      icon: <PersonOutline />,
      route: "/channel",
    },
    {
      id: 3,
      label: "Subscription",
      icon: <SubscriptionsOutlined />,
      route: "/subscriptions",
    },
  ];

  // User related menu items
  const userMenu = [
    { id: 1, label: "Shorts", icon: <SmartDisplayOutlined /> },
    { id: 2, label: "Playlists", icon: <PlaylistPlayOutlined /> },
    { id: 3, label: "Your Videos", icon: <VideoLibraryOutlined /> },
  ];

  // Explore section items
  const exploreMenu = [
    { id: 1, label: "Trending", icon: <WhatshotOutlined /> },
    { id: 2, label: "Shopping", icon: <StorefrontOutlined /> },
    { id: 3, label: "Music", icon: <MusicNoteOutlined /> },
    { id: 4, label: "Films", icon: <MovieOutlined /> },
    { id: 5, label: "Live", icon: <LiveTvOutlined /> },
    { id: 6, label: "Gaming", icon: <SportsEsportsOutlined /> },
  ];

  // Footer settings help items
  const settingsMenu = [
    { id: 1, label: "Settings", icon: <SettingsOutlined /> },
    { id: 2, label: "Report History", icon: <FlagOutlined /> },
    { id: 3, label: "Help", icon: <HelpOutline /> },
    { id: 4, label: "Send Feedback", icon: <FeedbackOutlined /> },
  ];

  return (
    <aside
      className={`
        bg-[#f1f1f1] fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-40 shadow-md
        transition-transform duration-300
        ${open ? "translate-x-0 w-64" : "-translate-x-full"}
        ${largeScreen ? "lg:translate-x-0 lg:w-64" : ""}
      `}
    >
      <nav className="pt-6 px-4 space-y-8 text-base text-gray-800 font-medium">
        {/* Main Navigation Section */}
        <div className="space-y-2">
          {mainMenu.map((item) => (
            <Link key={item.id} to={item.route}>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-200 group relative">
                <div className="text-xl group-hover:text-red-600">
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {/* Red bar for active */}
                {((item.route === "/" && currentPath === "/") ||
                  (item.route === "/subscriptions" &&
                    currentPath === "/subscriptions") ||
                  (item.route === "/channel" &&
                    (currentPath === "/channel" ||
                      currentPath === "/profile"))) && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-r"></span>
                )}
              </div>
            </Link>
          ))}

          {/* History link at bottom of main navigation */}
          <Link to="/history">
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-200 group relative">
              <div className="text-xl group-hover:text-red-600">
                <HistoryOutlined />
              </div>
              <span>History</span>
              {/* Red bar for active */}
              {currentPath === "/history" && (
                <span className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-r"></span>
              )}
            </div>
          </Link>
        </div>

        {/* Divider line */}
        <div className="my-4 border-t border-gray-300" />

        {/* Your content section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 font-semibold text-gray-900">
            <span>You</span>
            <ChevronRight />
          </div>
          {userMenu.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-200"
            >
              {item.route ? (
                <Link
                  to={item.route}
                  className="flex items-center gap-4 w-full"
                >
                  <div className="text-xl">{item.icon}</div>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  <div className="text-xl">{item.icon}</div>
                  <span>{item.label}</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="my-4 border-t border-gray-300" />

        {/* Explore Section */}
        <div className="space-y-2">
          <div className="font-semibold px-2 text-gray-900">Explore</div>
          {exploreMenu.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="text-lg">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="my-4 border-t border-gray-300" />

        {/* Settings & Feedback Section */}
        <div className="space-y-2">
          {settingsMenu.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="text-lg">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <footer className="text-xs text-gray-500 pt-4 leading-relaxed">
          <p>
            Terms · Privacy · Policy & Safety
            <br />
            How MyTube works
            <br />
            Test new features
          </p>
          <p className="font-medium mt-4">© Subha Goldar</p>
        </footer>
      </nav>
    </aside>
  );
};

export default Sidenav;
