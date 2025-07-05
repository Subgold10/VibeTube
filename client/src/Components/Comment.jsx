import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultProfilePic from "../assets/channels4_profile.jpg";

const Comment = ({ comment, onDelete }) => {
  // state to hold the user who posted the comment
  const [channel, setChannel] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // fetch the user info of cpmmented user
    const getCommentUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/find/${comment.userId}`
        );
        setChannel(res.data);
        console.log("Comment owner:", res.data);
      } catch (err) {
        console.log("Could not fetch user data:", err);
      }
    };

    getCommentUser();
  }, [comment.userId]);

  // function to delete comment
  const handleDelete = async () => {
    if (!currentUser) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          withCredentials: true, // Include cookies automatically
        }
      );

      console.log("Comment deleted:", res.data);
      onDelete(comment._id); // delete comment
    } catch (err) {
      console.log("Something went wrong while deleting comment:", err);
    }
  };

  return (
    <div className="flex gap-2 my-7">
      {/* user profile */}
      <img
        className="w-12 h-12 rounded-full object-cover"
        src={channel.img || defaultProfilePic}
        alt="avatar"
        onError={(e) => {
          e.target.src = defaultProfilePic;
        }}
      />

      {/* comment details */}
      <div className="flex flex-col gap-2 text-textColor">
        <span className="text-sm font-medium">
          {channel.name}
          <span className="text-xs font-normal text-textSoft ml-1">
            1 day ago
          </span>
        </span>

        {/* comment text */}
        <span className="text-base">{comment.desc}</span>
      </div>

      {/* show delete button if user is real */}
      {(currentUser?._id === comment.userId ||
        currentUser?._id === channel._id) && (
        <button
          onClick={handleDelete}
          className="text-red-500 text-xs px-2 py-[2px] border border-red-400 rounded-md hover:bg-red-500 hover:text-white transition-all duration-150"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
