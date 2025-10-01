import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoCard from "./Card";
import { toast } from "react-toastify";
import { Edit, Delete, Save, Close } from "@mui/icons-material";
import bannerImg from "../assets/banneryoutube.jpg";
import defaultAvatar from "../assets/channels4_profile.jpg";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [myVideos, setMyVideos] = useState([]);
  const [myChannel, setMyChannel] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (currentUser) {
      const fetchVideos = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/videos/user/${currentUser._id}`
          );
          setMyVideos(res.data);
        } catch {
          // error intentionally ignored
        }
      };
      const fetchChannel = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/channels/${currentUser._id}`
          );
          console.log("Channel data:", res.data); // Debug log
          setMyChannel(res.data);
        } catch (error) {
          console.log("Error fetching channel:", error);
          setMyChannel(null);
        }
      };
      fetchVideos();
      fetchChannel();
    }
  }, [currentUser]);

  const removeVideo = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/videos/${id}`);
      setMyVideos((prev) => prev.filter((v) => v._id !== id));
      toast.success("Video removed.");
    } catch {
      // error intentionally ignored
    }
  };

  const startEdit = (video) => {
    setEditingId(video._id);
    setEditTitle(video.title || "");
  };

  const saveTitle = async (id) => {
    // Validate input
    if (!editTitle || editTitle.trim().length < 3) {
      toast.error("Video title must be at least 3 characters long");
      return;
    }

    if (editTitle.trim().length > 100) {
      toast.error("Video title cannot exceed 100 characters");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/videos/${id}`,
        {
          title: editTitle.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMyVideos((prev) =>
          prev.map((v) =>
            v._id === id ? { ...v, title: editTitle.trim() } : v
          )
        );
        setEditingId(null);
        toast.success("Video title updated successfully!");
      }
    } catch (error) {
      console.error("Error updating video title:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update video title. Please try again.");
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleKeyPress = (e, videoId) => {
    if (e.key === "Enter") {
      saveTitle(videoId);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl font-semibold text-gray-700">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans pt-20">
      {myChannel && (
        <div>
          <div className="relative h-52 w-full bg-gray-200">
            {console.log("Banner URL:", myChannel.banner || bannerImg)}{" "}
            {/* Debug log */}
            <img
              src={myChannel.banner || bannerImg}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log("Banner image failed to load, using fallback");
                e.target.src = bannerImg;
              }}
            />
            <div className="absolute bottom-[-36px] left-14">
              <img
                src={myChannel.img || defaultAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
          </div>
          <div className="pt-16 pl-14 pr-4">
            <h2 className="text-2xl font-bold">{myChannel.name}</h2>
            <p className="text-sm text-gray-600">
              @{myChannel.description} • {myVideos.length} videos
            </p>
            <button className="mt-2 px-5 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </div>
      )}
      <div className="border-b border-gray-300 mt-6 px-14">
        <div className="flex gap-8 text-sm font-medium text-gray-700">
          <button className="py-3 border-b-2 border-black">Videos</button>
          <button className="py-3 hover:text-black">Shorts</button>
          <span className="py-3 text-red-500 cursor-default select-none">
            Live
          </span>
          <span className="py-3 text-blue-500 cursor-default select-none">
            Playlists
          </span>
          <span className="py-3 text-gray-500 cursor-default select-none">
            Community
          </span>
        </div>
      </div>
      <div className="px-14 mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Uploads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {myVideos.length > 0 ? (
            myVideos.map((video) => (
              <div
                key={video._id}
                className="relative group rounded-lg overflow-hidden"
              >
                <VideoCard videoData={video} />
                {editingId === video._id ? (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, video._id)}
                      className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => saveTitle(video._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Save />
                    </button>
                    <button
                      onClick={() => cancelEdit()}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Close />
                    </button>
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => startEdit(video)}
                      className="bg-white p-1 rounded-full shadow hover:shadow-md"
                    >
                      <Edit fontSize="small" />
                    </button>
                    <button
                      onClick={() => removeVideo(video._id)}
                      className="bg-white p-1 rounded-full shadow hover:shadow-md"
                    >
                      <Delete fontSize="small" color="error" />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              You haven't uploaded any videos yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
