import React, { useEffect, useRef, useState } from "react";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { ImLoop } from "react-icons/im";

export const AudioPlayer = ({
  tasks,
  index,
  audioRef,
  inputRef,
  transcript,
  updateTaskAndIndex,
  home
}) => {
  const [playbackRate, setPlaybackRate] = useState(1); // 1, 1.25, 1.5, 2, 0.5 (default 1)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopEnabled, setIsLoopEnabled] = useState(false); // [false, true

  const toogleLoop = () => {
    setIsLoopEnabled((prev) => !prev);
    if (isLoopEnabled) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changePlaybackRate = () => {
    const newRate =
      playbackRate === 1
        ? 1.25
        : playbackRate === 1.25
        ? 1.5
        : playbackRate === 1.5
        ? 2
        : playbackRate === 2
        ? 0.5
        : playbackRate === 0.5
        ? 1
        : 1.25;
    audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  useEffect(() => {
    // Add event listener for keyboard shortcuts
    window.addEventListener("keydown", handleKeyPress);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyPress = (e) => {
    // Play/Pause: command + enter , option + enter, ctrl + enter
    if (e.keyCode === 13 && (e.metaKey || e.ctrlKey || e.altKey)) {
      handlePlayPause();
    }
    // Loop: Alt/option + L key
    else if (e.altKey && e.keyCode === 76) {
      toogleLoop();
    }
    // Alt/Option + a = submit, Alt/Option + x reject , Alt/Option + s = save, Alt/Option + t = trash
    else if (e.altKey && e.keyCode === 65) {
      updateTaskAndIndex("submit", transcript, tasks[index]);
    } else if (e.altKey && e.keyCode === 88) {
      updateTaskAndIndex("reject", transcript, tasks[index]);
    } else if (e.altKey && e.keyCode === 83) {
      updateTaskAndIndex("save", transcript, tasks[index]);
    } else if (e.altKey && e.keyCode === 84) {
      updateTaskAndIndex("trash", transcript, tasks[index]);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        controls
        loop={isLoopEnabled}
        className="w-full"
        key={tasks[index]?.id}
      >
        <source src={tasks[index]?.url} type="audio/mp3" />
      </audio>
      <div className="flex gap-10 my-2">
        <div
          className="tooltip tooltip-bottom"
          data-tip={`${
            isPlaying ? "Pause" : "Play"
          } (command + enter, option + enter, ctrl + enter)`}
        >
          <button
            className="btn btn-outline px-5 py-2.5"
            onClick={() => handlePlayPause()}
          >
            {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip="Loop (Alt + l)">
          <button
            className={
              isLoopEnabled
                ? "btn px-5 py-2.5 bg-yellow-400 hover:bg-yellow-400"
                : "btn btn-outline px-5 py-2.5"
            }
            onClick={() => toogleLoop()}
          >
            <ImLoop />
          </button>
        </div>
        <button
          className="flex item-center btn btn-ghost text-lg p-2 font-semibold"
          onClick={changePlaybackRate}
        >
          <span className="text-xs">{home.speed}</span>
          <span>{playbackRate}X</span>
        </button>
      </div>
    </>
  );
};
