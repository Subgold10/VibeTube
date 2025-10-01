import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // for showing popup messages
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const VideoUpload = () => {
  const { currentUser } = useSelector((state) => state.user);

  // these are state variables to handle form inputs and file uploads
  const [title, setTitle] = useState(""); // video title
  const [desc, setDesc] = useState(""); // video description
  const [tags, setTags] = useState(""); // tags for video
  const [imgFile, setImgFile] = useState(null); // thumbnail file
  const [videoFile, setVideoFile] = useState(null); // actual video file
  const [loading, setLoading] = useState(false); // to show loading state while uploading

  // function to handle upload button click
  const handleUpload = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    // checking if all fields and files are filled
    if (!title || !desc || !imgFile || !videoFile) {
      toast.error("All fields and files are required");
      return;
    }

    setLoading(true);

    // making form data to send files and text together
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("tags", tags);
    formData.append("imgFile", imgFile);
    formData.append("videoFile", videoFile);

    try {
      // sending post request to backend API
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/videos`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", res.data);
      toast.success("Video uploaded!");

      // clearing the form after upload
      setTitle("");
      setDesc("");
      setTags("");
      setImgFile(null);
      setVideoFile(null);
    } catch (err) {
      console.log("Upload error:", err);
      if (err.response) {
        console.log("Error response:", err.response.data);
        toast.error(
          err.response.data.error || "Upload failed. Please try again."
        );
      } else if (err.request) {
        console.log("Network error:", err.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.log("Error:", err.message);
        toast.error("Something went wrong while uploading.");
      }
    }

    setLoading(false);
  };

  // if user is not logged in showmessage
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-lg mt-20 mx-auto p-8 bg-gray-800 rounded-lg text-white border">
          <h2 className="text-3xl font-bold mb-4 text-red-400">Login Needed</h2>
          <p>First login to upload videos.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-20 max-w-6xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex flex-col lg:flex-row gap-8 bg-[#0F0F0F] text-white">
        {/*File Uploads */}
        <div className="w-full lg:w-1/3 bg-[#1E1E1E] border border-gray-700 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold mb-4">Upload Files</h3>

          {/* Thumbnail Upload */}
          <div className="bg-[#2A2A2A] border border-gray-600 rounded p-5 text-center cursor-pointer">
            <label>
              <CloudUploadOutlinedIcon className="text-4xl text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImgFile(e.target.files[0])}
                className="hidden"
              />
              <p className="text-sm">
                {imgFile ? imgFile.name : "Upload Thumbnail"}
              </p>
            </label>
          </div>

          {/* Video Upload */}
          <div className="bg-[#2A2A2A] border border-gray-600 rounded p-5 text-center cursor-pointer">
            <label>
              <CloudUploadOutlinedIcon className="text-4xl text-gray-400 mb-2" />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="hidden"
              />
              <p className="text-sm">
                {videoFile ? videoFile.name : "Upload Video File"}
              </p>
            </label>
          </div>
        </div>

        {/*Video Details */}
        <div className="w-full lg:w-2/3 bg-[#1E1E1E] border border-gray-700 rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Video Details</h2>

          <div>
            <label className="text-sm text-gray-300 block mb-2">Title *</label>
            <input
              type="text"
              placeholder="Give your video a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-[#121212] text-white border border-gray-600 rounded"
            />
            <p className="text-right text-xs text-gray-500 mt-1">
              {title.length}/100
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Description
            </label>
            <textarea
              placeholder="Tell viewers about your video"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={5}
              className="w-full p-3 bg-[#121212] text-white border border-gray-600 rounded resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">Tags</label>
            <input
              type="text"
              placeholder="e.g., react, songs, css"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 bg-[#121212] text-white border border-gray-600 rounded"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-3 font-semibold rounded ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
