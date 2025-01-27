"use client";
import React from "react";
import { BsCheckLg, BsXLg, BsArrowReturnLeft, BsTrash } from "react-icons/bs";
import { useContext, useEffect } from "react";
import AppContext from "./AppContext";

const ActionButtons = ({ updateTaskAndIndex, tasks, transcript, role }) => {
  // a = 65 submit, x = 88 reject , s = 83 save, t = 84 trash
  const value = useContext(AppContext);
  let { lang } = value;

  useEffect(() => {
    // Add event listener for keyboard shortcuts
    window.addEventListener("keydown", handleKeyPress);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleKeyPress = (e) => {
    // Alt/Option + a = submit, Alt/Option + x reject , Alt/Option + s = save, Alt/Option + t = trash
    if (e.altKey && e.keyCode === 65) {
      document.getElementById("submit-button").click();
      return;
    } else if (e.altKey && e.keyCode === 88) {
      document.getElementById("reject-button").click();
      return;
    } else if (e.altKey && e.keyCode === 83) {
      document.getElementById("save-button").click();
      return;
    } else if (e.altKey && e.keyCode === 84) {
      document.getElementById("trash-button").click();
      return;
    }
  };

  return (
    <>
      <div className="md:fixed bottom-0 mt-4 flex gap-1 border shadow-sm p-2">
        <div className="md:tooltip tooltip-top" data-tip="Submit(Alt + a)">
          <button
            id="submit-button"
            type="button"
            className="focus:outline-none text-white bg-[#4fd364] font-medium text-md p-4 sm:p-9"
            onClick={() => updateTaskAndIndex("submit", transcript, tasks[0])}
          >
            <div className="flex flex-col items-center gap-1">
              <BsCheckLg width="5rem" />
              <p>{lang.submit}</p>
            </div>
          </button>
        </div>
        {role !== "TRANSCRIBER" && (
          <div className="md:tooltip tooltip-top" data-tip="Reject(Alt + x)">
            <button
              id="reject-button"
              type="button"
              className="focus:outline-none text-white bg-[#f74c4a] font-medium text-md p-4 sm:p-9"
              onClick={() => updateTaskAndIndex("reject", transcript, tasks[0])}
            >
              <div className="flex flex-col items-center gap-1">
                <BsXLg />
                <p>{lang.reject}</p>
              </div>
            </button>
          </div>
        )}
        <div className="md:tooltip tooltip-top" data-tip="Save(Alt + s)">
          <button
            id="save-button"
            type="button"
            className="focus:outline-none text-white bg-yellow-500 font-medium text-md p-4 sm:p-9"
            onClick={() => updateTaskAndIndex("save", transcript, tasks[0])}
          >
            <div className="flex flex-col items-center gap-1">
              <BsArrowReturnLeft />
              <p>{lang.save}</p>
            </div>
          </button>
        </div>
        <div className="md:tooltip tooltip-top" data-tip="Trash(Alt + t)">
          <button
            id="trash-button"
            type="button"
            className="focus:outline-none text-white bg-[#b9b9b9] font-medium text-md p-4 sm:p-9"
            onClick={() => updateTaskAndIndex("trash", transcript, tasks[0])}
          >
            <div className="flex flex-col items-center gap-1">
              <BsTrash />
              <p>{lang.trash}</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionButtons;
