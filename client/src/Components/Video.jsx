import { useEffect, useState } from "react";
// importing icons from material UI
import {
  ThumbUp as LikeIcon,
  ThumbUpOffAlt as LikeOutlineIcon,
  ThumbDown as DislikeIcon,
  ThumbDownOffAlt as DislikeOutlineIcon,
  Reply as ShareIcon,
  SaveAlt as SaveIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { addDislike, fetchDone, addLike } from "../redux/videoSlice";
import { toggleSubscription } from "../redux/userSlice";
import { format as timeAgo } from "timeago.js";
import Comments from "./Comments";
import Recommendation from "./Recommendation";
import defaultProfile from "../assets/channels4_profile.jpg";

const VideoPlayer = () => {
  const dispatch = useDispatch();

  const selectCurrentUser = (state) => state.user.currentUser;
  const selectCurrentVideo = (state) => state.video.currentVideo;
  const userLoggedIn = useSelector(selectCurrentUser);
  const videoData = useSelector(selectCurrentVideo);

  // Getting video ID from the URL
  const location = useLocation();
  const videoId = location.pathname.split("/")[2];

  // state for storing the channel/user who uploaded the video
  const [uploader, setUploader] = useState({});

  const API = import.meta.env.VITE_API_URL;

  //runs when component mounts or path changes
  useEffect(() => {
    async function fetchVideoAndUploader() {
      try {
        // First fetch the video data
        const videoRes = await axios.get(`${API}/videos/find/${videoId}`);

        if (!videoRes.data) {
          console.error("Video not found");
          return;
        }

        // Then fetch the channel info based on video userId
        if (videoRes.data.userId) {
          try {
            const userRes = await axios.get(
              `${API}/users/find/${videoRes.data.userId}`
            );
            setUploader(userRes.data || {});
          } catch (userError) {
            console.log("Error fetching user data:", userError);
            setUploader({});
          }
        }

        dispatch(fetchDone(videoRes.data));

        // Add video to history if user is logged in
        if (userLoggedIn) {
          try {
            await axios.post(`${API}/history/add`, {
              userId: userLoggedIn._id,
              videoId: videoId,
            });
          } catch (historyError) {
            console.log("Error adding to history:", historyError);
          }
        }
      } catch (error) {
        console.log("error while getting video/channel data", error);
      }
    }

    fetchVideoAndUploader();
  }, [videoId, dispatch, API, userLoggedIn]);

  // When user clicks like
  const handleLike = async () => {
    if (!userLoggedIn) return;
    try {
      await axios.put(
        `${API}/users/like/${videoData._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(addLike(userLoggedIn._id));
    } catch (err) {
      console.log("like error", err);
    }
  };

  // When user clicks dislike
  const handleDislike = async () => {
    if (!userLoggedIn) return;
    try {
      await axios.put(
        `${API}/users/dislike/${videoData._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(addDislike(userLoggedIn._id));
    } catch (err) {
      console.log("dislike error", err);
    }
  };

  // When user clicks subscribe nd unsubscribe
  const handleSubscribe = async () => {
    try {
      const isSubscribed = userLoggedIn.subscribedUsers.includes(uploader._id);
      const url = isSubscribed
        ? `${API}/users/unsub/${uploader._id}`
        : `${API}/users/sub/${uploader._id}`;
      await axios.put(
        url,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(toggleSubscription(uploader._id));
    } catch (err) {
      console.log("subscription error", err);
    }
  };

  // If video data is not ready yet show loading message
  if (!videoData) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-800">
        Loading video...
      </div>
    );
  }

  // Don't render if no video data
  if (!videoData || !videoData._id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-0 md:p-8 mt-16 bg-white text-black min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Main video and info */}
      <div className="w-full lg:w-2/3 px-0 md:px-4 lg:pl-8 lg:pr-4 max-w-full">
        {/* Video player section */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl max-w-full">
          {videoData.videoUrl &&
          (videoData.videoUrl.includes("youtube.com") ||
            videoData.videoUrl.includes("youtu.be")) ? (
            <iframe
              className="w-full h-full border-0"
              src={videoData.videoUrl.replace("watch?v=", "embed/")}
              title="YouTube Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              className="w-full h-full object-cover"
              src={
                videoData.videoUrl
                  ? `http://localhost:7272${videoData.videoUrl}`
                  : "http://localhost:7272/uploads/sample.mp4"
              }
              controls
              onError={(e) => {
                console.log("Video failed to load, using fallback");
                e.target.src = "http://localhost:7272/uploads/sample.mp4";
              }}
            />
          )}
        </div>

        {/* Video title */}
        <h2 className="text-3xl font-bold mt-4 mb-2 leading-tight text-gray-900">
          {videoData.title}
        </h2>

        {/* Views and action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 mb-4 gap-2">
          <span className="text-gray-600 text-sm">
            {videoData.views || 10000} views • {timeAgo(videoData.createdAt)}
          </span>
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-1 shadow-sm border border-gray-200">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-400 transition text-gray-700"
            >
              {videoData.likes?.includes(userLoggedIn?._id) ? (
                <LikeIcon />
              ) : (
                <LikeOutlineIcon />
              )}{" "}
              {videoData.likes?.length}
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleDislike}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-400 transition text-gray-700"
            >
              {videoData.dislikes?.includes(userLoggedIn?._id) ? (
                <DislikeIcon />
              ) : (
                <DislikeOutlineIcon />
              )}
            </button>
            <span className="text-gray-400">|</span>
            <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-400 transition text-gray-700">
              <ShareIcon /> Share
            </button>
            <span className="text-gray-400">|</span>
            <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 hover:bg-gray-400 transition text-gray-700">
              <SaveIcon /> Save
            </button>
          </div>
        </div>

        <hr className="my-4 border-t-2 border-gray-200" />

        {/* Channel info and subscribe */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="flex items-center gap-4">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={uploader.img || defaultProfile}
              alt={uploader.name}
              onError={(e) => {
                e.target.src = defaultProfile;
              }}
            />
            <div>
              <h3 className="font-semibold text-base">{uploader.name}</h3>
              <p className="text-sm text-gray-500">
                {uploader.subscribers} 10k subscribers
              </p>
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            className={`px-8 py-2 rounded-full font-bold text-base transition-all shadow-sm ${
              userLoggedIn.subscribedUsers?.includes(uploader._id)
                ? "bg-gray-500 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {userLoggedIn.subscribedUsers?.includes(uploader._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </button>
        </div>

        {/* Video description */}
        <div className="bg-gray-100 rounded-lg p-4 text-gray-800 text-sm mb-4">
          {videoData.desc}
        </div>

        {/* Comments section */}
        <div className="mt-6">
          <Comments videoId={videoData._id} />
        </div>
      </div>

      {/* Recommended videos sidebar */}
      <aside className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:pr-8 max-w-full">
        <Recommendation tags={videoData.tags} />
      </aside>
    </div>
  );
};

export default VideoPlayer;
