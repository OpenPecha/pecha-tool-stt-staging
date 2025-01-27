"use client";
import {
  assignMoreTasks,
  getNumberOfAssignedTask,
  getTasks,
  updateTask,
} from "@/model/action";
import React, { useState, useRef, useEffect } from "react";
import { AudioPlayer } from "./AudioPlayer";
import ActionButtons from "./ActionButtons";
import { UserProgressStats } from "@/model/task";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import AppContext from "../components/AppContext";
import { sendDiscordAlert } from "@/lib/webhookutils";
import { getTranscribingcount } from "@/model/group";

const AudioTranscript = ({ tasks, userDetail, language, userHistory }) => {
  const [languageSelected, setLanguageSelected] = useState("bo");
  const lang = language[languageSelected];
  const [taskList, setTaskList] = useState(tasks);
  const [transcript, setTranscript] = useState("");
  const [userTaskStats, setUserTaskStats] = useState({
    completedTaskCount: 0,
    totalTaskCount: 0,
    totalTaskPassed: 0,
  }); // {completedTaskCount, totalTaskCount, totalTaskPassed}
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id: userId, group_id: groupId, role } = userDetail;
  const currentTimeRef = useRef(null);
  const THRESHOLD = 3000;
  function getLastTaskIndex() {
    return taskList.length != 0 ? taskList?.length - 1 : 0;
  }
  useEffect(() => {
    getUserProgress();
    // Assign a value to currentTimeRef.current
    currentTimeRef.current = new Date().toISOString();
    if (taskList?.length) {
      setIsLoading(false);
      switch (role) {
        case "TRANSCRIBER":
          taskList[0]?.transcript != null && taskList[0]?.transcript != ""
            ? setTranscript(taskList[0]?.transcript)
            : setTranscript(taskList[0]?.inference_transcript);
          break;
        case "REVIEWER":
          taskList[0].reviewed_transcript != null &&
          taskList[0].reviewed_transcript != ""
            ? setTranscript(taskList[0]?.reviewed_transcript)
            : setTranscript(taskList[0]?.transcript);
          break;
        case "FINAL_REVIEWER":
          setTranscript(taskList[0]?.reviewed_transcript);
          break;
        default:
          break;
      }
    } else {
      setIsLoading(false);
    }
  }, [taskList]);

  const getUserProgress = async () => {
    const { completedTaskCount, totalTaskCount, totalTaskPassed } =
      await UserProgressStats(userId, role, groupId);
    setUserTaskStats({
      completedTaskCount,
      totalTaskCount,
      totalTaskPassed,
    });
  };

  const updateTaskAndIndex = async (action, transcript, task) => {
    try {
      const { id, group_id } = task;
      // console.log('Debug - Processing task update for group:', group_id);
      const taskCounts = await getTranscribingcount(group_id);
      const count = taskCounts?._count?.tasks ?? 0;
      const groupName = taskCounts?.name ?? "Unknown Group";
      if (count == THRESHOLD) {
        try {
          // console.log("Debug - Preparing to send alert:", { groupName, count });
          await sendDiscordAlert(groupName, count , THRESHOLD);
          // console.log(`Alert sent successfully for group ${groupName}`);
        } catch (error) {
          console.error(`Failed to send alert for ${groupName}:`, error);
        }
      }
      // update the task in the database
      const { msg, updatedTask } = await updateTask(
        action,
        id,
        transcript,
        task,
        role,
        currentTimeRef.current
      );

      if (msg?.error) {
        toast.error(msg.error);
        return;
      }
      toast.success(msg.success);

      // Update task list optimally based on action
      handleTaskListUpdate(action, id);
    } catch (error) {
      console.error("Failed to update task:", error);
      throw new Error("Failed to update task");
    }
  };

  const ASSIGN_BUFFER = 6;
  const TASK_LEFT_LIMIT = 10;

  const handleTaskListUpdate = async (action, id) => {
    if (action === "submit") {
      currentTimeRef.current = new Date().toISOString();
    }
    const lastTaskIndex = getLastTaskIndex();
    if (lastTaskIndex < TASK_LEFT_LIMIT) {
      const assignCount = await getNumberOfAssignedTask(userId, role, groupId);
      if (assignCount < ASSIGN_BUFFER) assignMoreTasks(groupId, userId, role);
    }
    if (lastTaskIndex !== 0) {
      setTaskList((prev) => prev.filter((task) => task.id !== id));
    } else {
      try {
        const moreTask = await getTasks(groupId, userId, role);
        setTaskList(moreTask);
      } catch (error) {
        console.error("Failed to fetch more tasks:", error);
        toast.error("Failed to load more tasks.");
      } finally {
        setIsLoading(false); // Ensure loading is always stopped after the operation
      }
    }
  };

  return (
    <AppContext.Provider
      value={{ languageSelected, setLanguageSelected, lang }}
    >
      <Sidebar
        userDetail={userDetail}
        userTaskStats={userTaskStats}
        taskList={taskList}
        role={role}
        setTaskList={setTaskList}
        userHistory={userHistory}
      >
        {/* Page content here */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center mt-10 p-5">
            <h1 className="font-bold text-md md:text-3xl">loading...</h1>
          </div>
        ) : taskList?.length ? (
          <>
            <div>
              <p className="mt-4 md:mt-10">
                <strong>{lang.transcriber} : </strong>
                <span>{taskList[0]?.transcriber?.name}</span>
              </p>
              <p className="mt-2">
                <strong>{lang.reviewer} : </strong>
                <span>{taskList[0]?.reviewer?.name}</span>
                {role === "TRANSCRIBER" && taskList[0]?.reviewer?.name ? (
                  <span className="text-red-500">
                    {" "}
                    (Rejected by {taskList[0]?.reviewer?.name})
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div className="border rounded-md shadow-sm shadow-gray-400 w-11/12 md:w-3/4 p-6 md:p-8 mt-4 md:mt-10 bg-base-100">
              <div className="flex flex-col gap-5 justify-center items-center">
                <AudioPlayer tasks={taskList} audioRef={audioRef} />
                <textarea
                  value={transcript || ""}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="rounded-md p-4 border border-slate-400 w-full text-xl bg-base-100 text-base-content"
                  placeholder="Type here..."
                  rows={6}
                  id="transcript"
                ></textarea>
                <div className="ml-auto text-xs">
                  <span>
                    <strong className="uppercase">{lang.file} : </strong>
                    {(taskList[0]?.url).split("/").pop()}
                  </span>
                </div>
              </div>
            </div>
            <ActionButtons
              updateTaskAndIndex={updateTaskAndIndex}
              tasks={taskList}
              transcript={transcript}
              role={role}
            />
          </>
        ) : (
          <div className="flex flex-col justify-center items-center mt-10 p-5">
            <h1 className="font-bold text-lg md:text-3xl">
              No task found, will allocate soon
            </h1>
          </div>
        )}
      </Sidebar>
    </AppContext.Provider>
  );
};

export default AudioTranscript;
