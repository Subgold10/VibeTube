import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoCard from "./Card";
import FilterButtons from "./FilterButtons";
import { Link } from "react-router-dom";

const HomePage = ({ type }) => {
  // all videos from API
  const [videos, setVideos] = useState([]);
  // filtered videos
  const [filteredVideos, setFilteredVideos] = useState([]);
  // default selected category is All
  const [selectedCategory, setSelectedCategory] = useState("All");
  // loading state
  const [loading, setLoading] = useState(false);
  // error state
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  // runs when type or currentUser changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/videos/${type}`
        );
        setVideos(res.data || []);
        setFilteredVideos(res.data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [type, currentUser]); // re-run if type or user changes

  // this useEffect runs whenever selectedCategory or videos change
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredVideos(videos);
    } else {
      // filter videos by matching tag
      const normalized = selectedCategory.toLowerCase();
      setFilteredVideos(
        videos.filter((video) =>
          video.tags?.some((tag) => tag.toLowerCase() === normalized)
        )
      );
    }
  }, [selectedCategory, videos]);

  return (
    <main className="pt-16 pb-4 pl-0 lg:pl-64 min-h-screen px-0 sm:px-4 md:px-6 xl:px-10 bg-[#f9f9f9] rounded-sm">
      {/* category filter buttons */}
      <FilterButtons
        selectedCategory={selectedCategory}
        setCategory={setSelectedCategory}
      />

      <div className="mt-8">
        {/* show login message */}
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-xl font-semibold text-black mb-4">
              Login to view content
            </p>
            <Link to="/signin">
              <button className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
                Sign In
              </button>
            </Link>
          </div>
        ) : (
          //show videos message
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-8 mt-8">
            {loading ? (
              // Loading state
              <div className="col-span-full text-center mt-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-black">
                  Loading videos...
                </p>
              </div>
            ) : error ? (
              // Error state
              <div className="col-span-full text-center mt-24">
                <p className="text-xl font-semibold text-red-600 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Try Again
                </button>
              </div>
            ) : filteredVideos.length > 0 ? (
              // show all filtered videos
              filteredVideos.map((video) => (
                <VideoCard key={video._id} videoData={video} />
              ))
            ) : (
              // if no videos found for selected category
              <div className="col-span-full text-center mt-24">
                <p className="text-xl font-semibold text-black mb-4">
                  No videos found in "{selectedCategory}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
