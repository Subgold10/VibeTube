import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoCard from "./Card";
import { toast } from "react-toastify";
import { Delete, ClearAll } from "@mui/icons-material";

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/history/user/${currentUser?._id}`
        );
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) {
      fetchHistory();
    }
  }, [currentUser?._id]);

  const clearHistory = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/history/user/${currentUser._id}`
      );
      setHistory([]);
      toast.success("History cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
  };

  const removeFromHistory = async (videoId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/history/user/${
          currentUser._id
        }/video/${videoId}`
      );
      setHistory((prev) => prev.filter((item) => item.videoId !== videoId));
      toast.success("Video removed from history");
    } catch (error) {
      console.error("Error removing from history:", error);
      toast.error("Failed to remove video from history");
    }
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl font-semibold text-gray-700">
          Please sign in to view your history.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Watch History</h1>
            <p className="text-gray-600 mt-1">
              {history.length} video{history.length !== 1 ? "s" : ""} in your
              history
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <ClearAll />
              Clear All History
            </button>
          )}
        </div>

        {/* History Videos */}
        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {history.map((item) => (
              <div key={item._id} className="relative group">
                <VideoCard videoData={item.video} />
                <button
                  onClick={() => removeFromHistory(item.videoId)}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-90"
                  title="Remove from history"
                >
                  <Delete fontSize="small" />
                </button>
                <div className="mt-2 text-xs text-gray-500">
                  Watched {new Date(item.watchedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No watch history
            </h3>
            <p className="text-gray-600">Videos you watch will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
