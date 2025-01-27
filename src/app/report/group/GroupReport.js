"use client";
import React, { useEffect, useState } from "react";
import {
  generateUserReportByGroup,
  generateReviewerReportbyGroup,
  generateFinalReviewerReportbyGroup,
} from "@/model/user";
import TranscriberReportTable from "./TranscriberReportTable";
import ReviewerReportTable from "./ReviewerReportTable";
import Select from "@/components/Select";
import DateInput from "@/components/DateInput";
import FinalReviewerTable from "./FinalReviewerTable";

const GroupReport = ({ groups }) => {
  const [usersStatistic, setUsersStatistic] = useState([]);
  const [reviewersStatistic, setReviewersStatistic] = useState([]);
  const [finalReviewersStatistic, setFinalReviewersStatistic] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");
  const [dates, setDates] = useState({ from: "", to: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectGroup) {
      setIsLoading(true); // Start loading
      async function fetchData() {
        try {
          const usersPromise = generateUserReportByGroup(selectGroup, dates);
          const reviewersPromise = generateReviewerReportbyGroup(
            selectGroup,
            dates
          );
          const finalReviewersPromise = generateFinalReviewerReportbyGroup(
            selectGroup,
            dates
          );

          // Use Promise.all to wait for all promises to resolve
          const [usersOfGroup, reviewersOfGroup, finalReviewersOfGroup] =
            await Promise.all([
              usersPromise,
              reviewersPromise,
              finalReviewersPromise,
            ]);

          setUsersStatistic(usersOfGroup);
          setReviewersStatistic(reviewersOfGroup);
          setFinalReviewersStatistic(finalReviewersOfGroup);
        } catch (error) {
          console.error("Error fetching group reports:", error);
        } finally {
          setIsLoading(false); // End loading
        }
      }
      fetchData();
    }
  }, [selectGroup, dates]);

  const handleGroupChange = async (event) => {
    setSelectGroup(event.target.value);
  };

  const handleDateChange = async (event) => {
    setDates((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <>
      <form className="sticky top-0 z-20 py-8 bg-base-100 flex flex-col md:flex-row justify-around items-center md:items-end space-y-5 space-x-0 md:space-y-0 md:space-x-10">
        <Select
          title="group_id"
          label="group"
          options={groups}
          selectedOption={selectGroup}
          handleOptionChange={handleGroupChange}
        />
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          <DateInput
            label="from"
            selectedDate={dates.from}
            handleDateChange={handleDateChange}
          />
          <DateInput
            label="to"
            selectedDate={dates.to}
            handleDateChange={handleDateChange}
          />
        </div>
      </form>
      <div className="flex flex-col gap-10 justify-center items-center my-10">
        {isLoading ? (
          <div className="text-center mt-10">
            <span className="loading loading-spinner text-success text-center"></span>
          </div>
        ) : (
          <>
            <TranscriberReportTable
              usersStatistic={usersStatistic}
              selectGroup={selectGroup}
            />
            <ReviewerReportTable reviewersStatistic={reviewersStatistic} />
            <FinalReviewerTable
              finalReviewersStatistic={finalReviewersStatistic}
            />
          </>
        )}
      </div>
    </>
  );
};

export default GroupReport;
