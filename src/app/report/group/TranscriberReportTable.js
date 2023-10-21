import Link from "next/link";
import React from "react";
import { calculatePay } from "@/lib/calculatePay";
import { calculatePercent } from "@/lib/calculatePercent";
const TranscriberReportTable = ({ usersStatistic, selectGroup }) => {

  const glideGreentoRed = (num1, num2) => {
    // Calculate the percentage
    const percentage = calculatePercent(num1, num2);
    // if else to return the color based on the percentage
    if (percentage > 90) {
      return "bg-[#ff0000]"; // Red
    } else if (percentage > 80) {
      return "bg-[#ff4500]"; // Red-orange
    } else if (percentage > 70) {
      return "bg-[#ff7700]"; // Dark orange
    } else if (percentage > 60) {
      return "bg-[#ffa700]"; // Orange
    } else if (percentage > 50) {
      return "bg-[#ffc700]"; // Orange-yellow
    } else if (percentage > 40) {
      return "bg-[#fff400]"; // Yellow
    } else if (percentage > 30) {
      return "bg-[#cfff00]"; // Light lime green
    } else if (percentage > 20) {
      return "bg-[#a3ff00]"; // Lime green
    } else if (percentage > 10) {
      return "bg-[#4edc00]"; // Light green
    } else {
      return "bg-[#2cba00]"; // Dark green
    }
  };

  const glideRedtoGreen = (num1, num2) => {
    // Calculate the percentage
    const percentage = calculatePercent(num1, num2);
    // if else to return the color based on the percentage
    if (percentage > 90) {
      return "bg-[#2cba00]"; // Dark green
    } else if (percentage > 80) {
      return "bg-[#4edc00]"; // Light green
    } else if (percentage > 70) {
      return "bg-[#a3ff00]"; // Lime green
    } else if (percentage > 60) {
      return "bg-[#cfff00]"; // Light lime green
    } else if (percentage > 50) {
      return "bg-[#fff400]"; // Yellow
    } else if (percentage > 40) {
      return "bg-[#ffc700]"; // Orange-yellow
    } else if (percentage > 30) {
      return "bg-[#ffa700]"; // Orange
    } else if (percentage > 20) {
      return "bg-[#ff7700]"; // Dark orange
    } else if (percentage > 10) {
      return "bg-[#ff4500]"; // Red-orange
    } else {
      return "bg-[#ff0000]"; // Red
    }
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg w-11/12 md:w-4/5 max-h-[80vh]">
      <table className="table  ">
        {/* head */}
        <thead
          className="text-gray-700 bg-gray-50
          "
        >
          <tr>
            <th>Transcriber Name</th>
            <th>
              Task <br /> Submitted
            </th>
            <th>
              Task <br /> Reviewed
            </th>
            <th>Reviewed %</th>
            <th>Submitted Min.</th>
            <th>Reviewed Min.</th>
            <th>Reviewed min %</th>
            <th>Task Corrected %</th>
            <th>Character Error %</th>
            <th>
              Reviewed <br /> Syllable count
            </th>
            <th>Rs.</th>
          </tr>
        </thead>
        <tbody>
          {usersStatistic?.map((user) => (
            <tr key={user.id}>
              <td>
                <Link href={`/report/user/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.noSubmitted}</td>
              <td>{user.noReviewed}</td>
              <td className={`${glideRedtoGreen(user.noReviewed, user.noSubmitted)}`}>
                {calculatePercent(user.noReviewed, user.noSubmitted)}
              </td>
              <td>{user.submittedInMin}</td>
              <td>{user.reviewedInMin}</td>
              <td>
                {calculatePercent(user.reviewedInMin, user.submittedInMin)}
              </td>
              <td className={`${glideGreentoRed(user.noReviewedCorrected, user.noReviewed)}`}>
                {calculatePercent(user.noReviewedCorrected, user.noReviewed)}
              </td>
              <td className={`${glideGreentoRed(user.cer, user.characterCount)}`}>
                {calculatePercent(user.cer, user.characterCount)}
              </td>
              <td>{user.syllableCount}</td>
              <td>
                {calculatePay(
                  selectGroup,
                  user.reviewedSecs,
                  user.syllableCount,
                  user.noReviewed
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <b>Total</b>
            </td>
            <td>
              <b>{usersStatistic?.reduce((a, b) => a + b.noSubmitted, 0)}</b>
            </td>
            <td>
              <b>{usersStatistic?.reduce((a, b) => a + b.noReviewed, 0)}</b>
            </td>
            <td>
              <b>
                {calculatePercent(
                  usersStatistic?.reduce((a, b) => a + b.noReviewed, 0),
                  usersStatistic?.reduce((a, b) => a + b.noSubmitted, 0)
                )}
              </b>
            </td>
            <td>
              <b>
                {usersStatistic?.reduce((a, b) => a + b.submittedInMin, 0)}
              </b>
            </td>
            <td>
              <b>{usersStatistic?.reduce((a, b) => a + b.reviewedInMin, 0)}</b>
            </td>
            <td>
              <b>
                {calculatePercent(
                  usersStatistic?.reduce((a, b) => a + b.reviewedInMin, 0),
                  usersStatistic?.reduce((a, b) => a + b.submittedInMin, 0)
                )}
              </b>
            </td>
            <td>
              <b>
                {calculatePercent(
                  usersStatistic?.reduce(
                    (a, b) => a + b.noReviewedCorrected,
                    0
                  ),
                  usersStatistic?.reduce((a, b) => a + b.noReviewed, 0)
                )}
              </b>
            </td>
            <td>
              <b>
                {calculatePercent(
                  usersStatistic?.reduce((a, b) => a + b.cer, 0),
                  usersStatistic?.reduce((a, b) => a + b.characterCount, 0)
                )}
              </b>
            </td>
            <td>
              <b>
                {usersStatistic?.reduce((a, b) => a + b.syllableCount, 0)}
              </b>
            </td>
            <td>
              <b>
                {calculatePay(
                  selectGroup,
                  usersStatistic?.reduce((a, b) => a + b.reviewedSecs, 0),
                  usersStatistic?.reduce((a, b) => a + b.syllableCount, 0),
                  usersStatistic?.reduce((a, b) => a + b.noReviewed, 0)
                )}
              </b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TranscriberReportTable;
