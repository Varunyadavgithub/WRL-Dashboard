import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="sticky top-0 z-10 bg-white p-3 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={assets.logo} alt="Western Logo" className="h-10 w-auto mr-3" />
          <h1 className="text-2xl font-bold text-blue-800 tracking-wide">
            Western Refrigeration
          </h1>
        </Link>
        <div className="flex items-center gap-2 border-gray-700">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-white">
            U
          </div>
          <div>
            <div className="text-black font-semibold font-playfair">
              Varun Yadav
            </div>
            <div className="text-gray-400 text-sm">Admin</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;