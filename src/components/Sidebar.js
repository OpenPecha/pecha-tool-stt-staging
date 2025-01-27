import React from "react";
import AppContext from "./AppContext";
import { useContext } from "react";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { BsCheckLg, BsTrash } from "react-icons/bs";
import { getTaskWithRevertedState } from "@/model/task";

const Sidebar = ({
  children,
  userDetail,
  userTaskStats,
  taskList,
  role,
  setTaskList,
  userHistory,
}) => {
  const { completedTaskCount, totalTaskCount, totalTaskPassed } = userTaskStats;
  const value = useContext(AppContext);
  let { lang } = value;

  const handleHistoryClick = async (task) => {
    // get the task from db with task state step down by 1
    // if it is not, just push the new task to the top
    const newTask = await getTaskWithRevertedState(task, role);
    setTaskList([newTask, ...taskList]);
    return;
  };

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center">
          {/* Navbar */}
          <div className="w-full navbar text-white bg-[#384451] lg:hidden">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2">Pecha STT Tool</div>
          </div>
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <div className="flex flex-col w-80 min-h-full h-full bg-base-200 text-base-content">
            <section className="px-5 pt-5 pb-2 mb-2 border-b border-b-[#384451]">
              <h3 className="uppercase font-bold mb-2">{lang.project}</h3>
              <div className="flex text-right justify-between">
                <label className="text-sm font-bold mb-2">{lang.user}</label>
                <span className="text-right">{userDetail.name}</span>
              </div>
              <div className="flex text-right justify-between">
                <label className="text-sm font-bold mb-2">{lang.group}</label>
                <span className=" text-right">{userDetail.group.name}</span>
              </div>
              <div className="flex text-right justify-between">
                <label className="text-sm font-bold mb-2">{lang.task}</label>
                <span className=" text-right">{taskList[0]?.id}</span>
              </div>
            </section>
            <section className="px-5 pb-2 mb-2 border-b border-b-[#384451]">
              <h3 className="uppercase font-bold mb-2">{lang.target}</h3>
              {/*   <div
                className="tooltip tooltip-bottom w-full my-2"
                data-tip={`${completedTaskCount}/${totalTaskCount}`}
              >
                <progress
                  className="progress progress-success"
                  value={completedTaskCount}
                  max={totalTaskCount}
                ></progress>
              </div>
              */}
              <div
                className="tooltip tooltip-top flex text-right justify-between"
                data-tip={
                  role === "TRANSCRIBER"
                    ? "No. of task submitted by you"
                    : role === "REVIEWER"
                    ? "No. of task reviewed by you"
                    : "No. of task finalised by you"
                }
              >
                <label className=" text-sm font-bold mb-2">
                  {role === "TRANSCRIBER"
                    ? lang.submitted
                    : role === "REVIEWER"
                    ? lang.reviewed
                    : lang.final_reviewed}
                </label>
                <span className="text-right">{completedTaskCount}</span>
              </div>
              {(role === "TRANSCRIBER" || role === "REVIEWER") && (
                <div
                  className="tooltip tooltip-top flex text-right justify-between"
                  data-tip={
                    role === "TRANSCRIBER"
                      ? "No. of task reviewed by reviewer"
                      : role === "REVIEWER"
                      ? "No. of task finalised by final reviewer"
                      : ""
                  }
                >
                  <label className="text-sm font-bold mb-2">
                    {role === "TRANSCRIBER"
                      ? lang.reviewed
                      : role === "REVIEWER"
                      ? lang.final_reviewed
                      : ""}
                  </label>
                  <span className=" text-right">{totalTaskPassed}</span>
                </div>
              )}
              <div
                className="tooltip tooltip-top flex text-right justify-between"
                data-tip={
                  role === "TRANSCRIBER" || role === "REVIEWER"
                    ? "No. of task assigned to you"
                    : "No. of task accepted"
                }
              >
                <label className="text-sm font-bold mb-2">
                  {lang.total_assigned}
                </label>
                <span className=" text-right">{totalTaskCount}</span>
              </div>
            </section>
            <section className="flex gap-4 align-middle px-5 pb-2 mb-2 border-b border-b-[#384451]">
              <h3 className="uppercase font-bold">{lang.language}</h3>
              <LanguageToggle />
            </section>
            <section className="flex gap-4 align-middle px-5 pb-2 mb-2 border-b border-b-[#384451]">
              <h3 className="uppercase font-bold">{lang.theme}</h3>
              <ThemeToggle />
            </section>
            <section className="px-5 pb-5 mb-5 pt-1 border-b border-b-[#384451] overflow-y-auto flex-1">
              <h3 className="uppercase font-bold pb-2 top-0 sticky">
                {lang.history}
              </h3>
              {userHistory.map((task) => (
                <div
                  key={task.id}
                  className="py-4 cursor-pointer flex justify-between gap-1 items-center border-b-2 border-b-[#384451]"
                  onClick={() => handleHistoryClick(task)}
                >
                  <p className="text-lg line-clamp-2">
                    {role === "TRANSCRIBER"
                      ? task.transcript !== null
                        ? task.transcript
                        : task.inference_transcript
                      : role === "REVIEWER"
                      ? task.reviewed_transcript !== null
                        ? task.reviewed_transcript
                        : task.transcript
                      : task.final_transcript !== null
                      ? task.final_transcript
                      : task.reviewed_transcript}
                  </p>
                  <div
                    className="tooltip tooltip-left"
                    data-tip={`${task.state}`}
                  >
                    {(task.state === "submitted" ||
                      task.state === "accepted" ||
                      task.state === "finalised") && <BsCheckLg size="1rem" />}
                    {task.state === "trashed" && <BsTrash size="1rem" />}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
