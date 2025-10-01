import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format as timeAgoFormat } from "timeago.js";
import defaultProfilePic from "../assets/channels4_profile.jpg";

const VideoCard = ({ variant = "default", videoData }) => {
  const [uploader, setUploader] = useState(null);

  useEffect(() => {
    const getUploader = async () => {
      if (videoData?.userId) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/find/${videoData.userId}`
          );
          setUploader(response.data);
        } catch (fetchErr) {
          console.error("Failed to fetch uploader info:", fetchErr);
        }
      }
    };
    getUploader();
  }, [videoData?.userId]);

  if (!videoData) return <p>Loading video...</p>;

  const thumbSrc = videoData.imgUrl?.startsWith("http")
    ? videoData.imgUrl
    : `http://localhost:7272${videoData.imgUrl || "/uploads/placeholder.jpg"}`;

  return (
    <Link to={`/video/${videoData._id}`} className="w-full">
      <div
        className={`group transition-all duration-200 cursor-pointer bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 ${
          variant === "sm" ? "flex gap-3 w-full" : "hover:scale-[1.03]"
        }`}
      >
        <div
          className={`relative ${
            variant === "sm"
              ? "w-[168px] h-[94px] flex-shrink-0"
              : "w-full pb-[56.25%]"
          } bg-gray-200 rounded-xl overflow-hidden`}
        >
          <img
            src={thumbSrc}
            alt={videoData.title}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
            onError={(e) => {
              console.log("Thumbnail failed to load, using fallback");
              e.target.src = "http://localhost:7272/uploads/placeholder.jpg";
            }}
          />
        </div>
        <div
          className={`flex ${
            variant === "sm" ? "flex-col justify-between" : "flex mt-3 gap-3"
          }`}
        >
          {variant !== "sm" && (
            <img
              src={uploader?.img || defaultProfilePic}
              alt={uploader?.name}
              className="w-9 h-9 rounded-full bg-gray-300 border border-gray-200 shadow"
            />
          )}
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2">
              {videoData.title || "Untitled Video"}
            </h3>
            <p
              className={`flex items-center gap-2 text-xs text-gray-700 mt-[2px] font-semibold`}
            >
              {uploader?.name || "Unknown Channel"}
            </p>
            <p className="text-xs text-gray-500 mt-[1px]">
              {typeof videoData.views === "number" ? videoData.views : 0} views
              • {timeAgoFormat(videoData.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
