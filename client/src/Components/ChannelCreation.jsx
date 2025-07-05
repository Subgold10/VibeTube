import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateChannel = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [created, setCreated] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfChannelExists = async () => {
      if (currentUser) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/channels/${currentUser._id}`
          );
          if (res.data) {
            navigate("/profile");
          }
        } catch {
          // error intentionally ignored - channel doesn't exist yet
        }
      }
    };
    checkIfChannelExists();
  }, [currentUser, navigate]);

  const handleCreate = async () => {
    if (!name || !desc) {
      toast.error("Both fields are required");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/channels`,
        { name, description: desc },
        { withCredentials: true }
      );
      toast.success("Channel is created!");
      setCreated(true);
      setTimeout(() => {
        navigate("/profile");
      }, 1300);
    } catch {
      toast.error("Something went wrong or already created");
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-lg mt-20 mx-auto p-8 bg-gray-800 rounded-lg text-white border">
          <h2 className="text-3xl font-bold mb-4 text-red-400">Login Needed</h2>
          <p>First login to create your channel.</p>
        </div>
      </div>
    );
  }
  if (created) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-green-600 text-xl font-semibold">Channel created!</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">
          How you'll appear
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="e.g. Subha Goldar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            placeholder="e.g. This is my Capstone Project!"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <p className="text-xs text-gray-500 mb-6">
          By clicking Create Channel you agree to{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            MyTube's Terms of Service
          </span>
          . Changes to your name or profile image will only apply to MyTube.
        </p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
