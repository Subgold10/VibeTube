import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import dp from "../assets/11539820.png";

const Comments = ({ videoId }) => {
  // current loggedIn user from redux store
  const { currentUser } = useSelector((state) => state.user);

  // state to show all comments of the video
  const [comments, setComments] = useState([]);

  // state for writing a new comment
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // this runs when videoId changes
    const getComments = async () => {
      if (!videoId) {
        console.log("No videoId provided");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/comments/${videoId}`
        );
        setComments(res.data || []);
        console.log("Fetched comments:", res.data);
      } catch (err) {
        console.log("couldn't load comments", err);
        setComments([]);
      }
    };

    getComments();
  }, [videoId]);

  // function to post new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      console.log("Empty comment, not adding");
      return;
    }

    if (!videoId) {
      console.log("No videoId available");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/`,
        {
          videoId,
          desc: newComment,
        },
        {
          withCredentials: true, // Include cookies automatically
        }
      );

      if (res.data) {
        setComments((prev) => [res.data, ...prev]); // show new comment on top
        setNewComment("");
        console.log("Comment added");
      }
    } catch (err) {
      console.log("error posting comment", err);
    }
  };

  // delete comment
  const handleDeleteComment = (id) => {
    const updated = comments.filter((comment) => comment._id !== id);
    setComments(updated);
  };

  return (
    <div className="w-full">
      {/* comment input box */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={currentUser?.img || dp}
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.src = dp;
          }}
        />
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full border-b border-gray-300 bg-white dark:bg-gray-800 outline-none p-2 text-gray-800 dark:text-white rounded-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Comment
        </button>
      </div>

      {/* show list of comments */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onDelete={handleDeleteComment}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      )}
    </div>
  );
};

export default Comments;
