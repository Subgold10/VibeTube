import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { beginLogin, loginComplete, loginError } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserProfile from "./UserProfile";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectCurrentUser = (state) => state.user.currentUser;
  const userLoggedIn = useSelector(selectCurrentUser);
  const API_URL = import.meta.env.VITE_API_URL;

  // state to hold sign in foem data
  const [signInData, setSignInData] = useState({ name: "", password: "" });
  // state to hold sign up form data
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // toggle between sign in and sign up form
  const [isSignUp, setIsSignUp] = useState(false);

  // update sign in data when input changess
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  // update sign up data when input changes
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  // handle sign in form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    // check if both fields are filled
    if (!signInData.name || !signInData.password) {
      toast.warn("Please fill in both username and password.");
      return;
    }

    dispatch(beginLogin());
    try {
      // send login data to server
      const response = await axios.post(
        `${API_URL}/auth/signin`,
        { name: signInData.name, password: signInData.password },
        { withCredentials: true }
      );

      dispatch(loginComplete(response.data));
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginError());
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // handle sign up form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    // check if all fields are filled
    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      toast.warn("Please fill in all the sign-up fields.");
      return;
    }

    try {
      // send sign up data to server
      await axios.post(
        `${API_URL}/auth/signup`,
        {
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
        },
        { withCredentials: true }
      );

      toast.success("Account created! Please sign in.");
      setIsSignUp(false);
      setSignUpData({ name: "", email: "", password: "" });
    } catch (error) {
      console.log(error.message);
      toast.error("Sign-up failed. Try again later.");
    }
  };

  // if user already logged in, show profile instead of sign in form
  if (userLoggedIn) {
    return <UserProfile currentUser={userLoggedIn} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 dark:text-gray-100">
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-6 rounded-lg w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Create an Account" : "Sign In"}
        </h1>

        {isSignUp ? (
          // sign up form
          <form onSubmit={handleSignUp} className="flex flex-col space-y-3">
            <input
              name="name"
              type="text"
              placeholder="Username"
              value={signUpData.name}
              onChange={handleSignUpChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-transparent"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-transparent"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={handleSignUpChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-transparent"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Sign Up
            </button>
            <p className="text-center mt-2 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        ) : (
          // sign in form
          <form onSubmit={handleLogin} className="flex flex-col space-y-3">
            <input
              name="name"
              type="text"
              placeholder="Username"
              value={signInData.name}
              onChange={handleSignInChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-transparent"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={signInData.password}
              onChange={handleSignInChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-transparent"
            />
            <button
              type="submit"
              className="w-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition cursor-pointer"
            >
              Sign In
            </button>
            <p className="text-center mt-2 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Create one
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
