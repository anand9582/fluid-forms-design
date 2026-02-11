import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center max-w-md">
        {/* Big 404 number */}
        <h1 className="text-[10rem] font-extrabold text-indigo-600 leading-none">404</h1>

        {/* Cute message */}
        <p className="text-xl sm:text-2xl font-semibold text-gray-700 mt-4">
          Oops! Page Not Found
        </p>
        <p className="text-gray-500 mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button back to dashboard or home */}
        <Link to="/dashboard">
          <Button className="mt-6 px-6 py-3 bg-slate-500 hover:bg-indigo-700 text-white rounded-sm shadow-sm transition-all duration-300">
            Go Back Home
          </Button>
        </Link>

        {/* Optional illustration or SVG */}
        <div className="mt-8">
          <svg
            className="w-64 h-64 mx-auto text-indigo-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
