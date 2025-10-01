import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();
  console.log("Route Error:", err);

  return (
    <div className="error-page text-center p-8">
      <h1 className="text-4xl font-bold">Oopppssss!!</h1>
      <h2 className="text-2xl text-gray-700">
        {err?.status} - {err?.statusText || "Something went wrong"}
      </h2>

      <p className="text-xl text-gray-500">
        {err?.data ? err.data : "Sorry, we couldn't find that page."}
      </p>

      <Link
        to="/"
        className="mt-4 inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all duration-300"
      >
        Go Back to Home Page
      </Link>
    </div>
  );
};
export default Error;
