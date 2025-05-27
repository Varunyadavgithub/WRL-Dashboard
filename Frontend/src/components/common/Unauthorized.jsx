import { Link } from "react-router-dom";
import { FaLock, FaArrowLeft } from "react-icons/fa";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <section className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="flex items-center justify-center gap-4">
              <FaLock
                className="text-yellow-500 dark:text-yellow-400"
                size={64}
              />
              <h1 className="text-yellow-500 dark:text-yellow-400 font-extrabold text-7xl lg:text-9xl select-none">
                401
              </h1>
            </div>

            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Unauthorized Access
            </p>
            <p className="mb-4 text-lg font-light text-gray-600 dark:text-gray-400">
              You do not have permission to view this page. Please contact the
              administrator or return to the homepage.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-yellow-900 my-4"
            >
              <FaArrowLeft />
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Unauthorized;
