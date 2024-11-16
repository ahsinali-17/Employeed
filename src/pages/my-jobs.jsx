import React, { useEffect } from "react";
import { getJobs } from "@/api/apijobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import JobCard from "@/components/Job-Card";
import { getApplications } from "@/api/apiApplications";
import ApplicationCard from "@/components/ApplicationCard";

const MyJobs = () => {
  const {
    data: myJobs,
    error: myJobError,
    loading: myJobLoading,
    fn: myJobFn,
  } = useFetch(getJobs);

  const {
    data: myApplications,
    error: myAppError,
    loading: myAppLoading,
    fn: myAppFn,
  } = useFetch(getApplications);

  const { isLoaded, user } = useUser();
  
  useEffect(() => {
    if (isLoaded) {
      if (user?.unsafeMetadata?.role === "recruiter") {
        myJobFn();
      } else {
        myAppFn();
      }
    }
  }, [isLoaded]);

  if (myJobLoading || myAppLoading || !isLoaded)
    return (
      <p className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
        Loading...
      </p>
    );

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "recruiter"
          ? "My Jobs"
          : "My Applications"}
      </h1>
      {user?.unsafeMetadata?.role === "recruiter" ? (
        <>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs?.length ? (
              myJobs.map((job) => {
                if(job.recruiter_id === user.id)
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSavedCard={false}
                    isMyJob={true}
                    jobFn={myJobFn}
                  />
                );
              })
            ) : (
              <p className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
                No jobs Created...
              </p>
            )}
          </div>
          {myJobError && (
            <p className="w-[100%] text-red-500 mb-4 font-bold text-2xl text-center">{`Error fetching saved jobs ${myJobError}`}</p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 w-[90%] mx-auto">
            {myApplications?.length ? (
              myApplications?.map((app) => {
                if(app.candidate_id === user.id){
                return <ApplicationCard
                    key={app.id}
                    application={app}
                    isCandidate={true}
                    jobFn={myAppFn}
                  />
                }
              })
            ) : (
              <p className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
                No Applications found...
              </p>
            )}
          </div>
          {myAppError && (
            <p className="w-[100%] text-red-500 mb-4 font-bold text-2xl text-center">{`Error fetching saved jobs ${myAppError}`}</p>
          )}
        </>
      )}
    </div>
  );
};

export default MyJobs;
