import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Sidebar from "./Sidebar";
import { useContext } from "react";
import AppContext from "./AppContext";
const Navbar = () => {
  const value = useContext(AppContext);
  let { languageSelected, setLanguageSelected } = value;
  return (
    <>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          onChange={() =>
            setLanguageSelected((prev) => (prev === "en" ? "bo" : "en"))
          }
        />
        <div className="w-9 h-5 bg-gray-200 border border-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-base-content">
          {languageSelected}
        </span>
      </label>
    </>
  );
};

export default Navbar;
