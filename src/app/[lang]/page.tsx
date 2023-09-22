import Link from "next/link";
import AudioTranscript from "@/components/AudioTranscript";
import RightSidebar from "@/components/RightSidebar";
import { getUserTask } from "@/model/action";
import { Locale } from "../../../i18n-config";
import { getDictionary } from "../../../dictionaries";

export default async function Home({
  searchParams,
  params: { lang },
}: {
  searchParams: any;
  params: { lang: Locale };
}) {
  const { home } = await getDictionary(lang);
  console.log("lang home  ", home);
  const { session } = searchParams;
  let userTasks;
  let userDetail;
  let errMsg;
  if (session && session !== "") {
    const result = await getUserTask(session);
    if (result?.error) {
      errMsg = result?.error;
    } else {
      userTasks = result?.userTasks;
      userDetail = result?.userData;
    }
  }

  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto">
      {session === undefined || session === "" ? (
        <>
          <div className="text-xl font-semibold mt-10 p-5 text-center">
            please log in to it with correct username - ?session=username
            <span className="block">or</span>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row">
            <Link href="dashboard" type="button" className="btn btn-accent">
              Dashboard
            </Link>
            <Link href="report/group" type="button" className="btn btn-accent">
              Report
            </Link>
          </div>
        </>
      ) : errMsg ? (
        <div className="mt-10 p-5 text-xl font-semibold text-center">
          {errMsg}
        </div>
      ) : (
        <AudioTranscript
          tasks={userTasks}
          userDetail={userDetail}
          home={home}
        />
      )}
      <RightSidebar>
        <iframe
          className="h-full"
          src="https://docs.google.com/spreadsheets/d/1Sn9IO9Gxj0swe7CdZPAsKx3ccBiDAtNHTvBDoMn7iqA/edit?usp=sharing"
        ></iframe>
      </RightSidebar>
    </div>
  );
}
