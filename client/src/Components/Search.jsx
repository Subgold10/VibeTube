import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import VideoCard from "./Card";

const Search = () => {
  // state to store videos that match search
  const [videos, setVideos] = useState([]);
  // get current logged in user from redux store
  const { currentUser } = useSelector((state) => state.user);
  // get the search query from URL
  const query = useLocation().search;

  // when currentuser changes run this
  useEffect(() => {
    if (!currentUser) return;

    // async function to get search results from server
    const fetchSearchResults = async () => {
      try {
        // call backend API with the search query
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/videos/search${query}`
        );

        if (response && response.data) {
          setVideos(response.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.log("Something went wrong while searching:", err);
      }
    };

    fetchSearchResults();
  }, [query, currentUser]);

  return (
    // container for videos
    <div className="mt-16 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Search Results
        </h2>

        {videos.length > 0 ? (
          // Responsive grid for videos
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {videos.map((video) => (
              <div key={video._id}>
                <VideoCard videoData={video} />
              </div>
            ))}
          </div>
        ) : (
          // if no videos found, show this message
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-gray-600 mb-2">
              No videos found
            </p>
            <p className="text-gray-500">
              Try adjusting your search terms or browse our trending videos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
