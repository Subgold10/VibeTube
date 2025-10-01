import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MainApp from "./App.jsx";
import { StrictMode, Suspense, lazy } from "react";
import Error from "./Components/Error.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";

// Lazy loading
const HomePage = lazy(() => import("./Components/HomePage.jsx"));
const ProfilePage = lazy(() => import("./Components/UserProfile.jsx"));
const VideoPlayer = lazy(() => import("./Components/Video.jsx"));
const SignIn = lazy(() => import("./Components/SignIn.jsx"));
const Search = lazy(() => import("./Components/Search.jsx"));
const CreateChannel = lazy(() => import("./Components/ChannelCreation.jsx"));
const VideoUpload = lazy(() => import("./Components/VideoUpload.jsx"));
const History = lazy(() => import("./Components/History.jsx"));

const Fallback = <p className="text-center text-lg">Loading...</p>;

// Setting up routes
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainApp />,
    errorElement: <Error />,
    children: [
      { index: true, element: <HomePage type="random" /> },
      { path: "trends", element: <HomePage type="trend" /> },
      { path: "subscriptions", element: <HomePage type="sub" /> },
      { path: "search", element: <Search /> },
      { path: "channel", element: <CreateChannel /> },
      { path: "signin", element: <SignIn /> },
      { path: "video/:id", element: <VideoPlayer /> },
      { path: "upload", element: <VideoUpload /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "history", element: <History /> },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={Fallback}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
