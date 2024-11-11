import React, { useEffect } from "react";
import { getSavedJobs } from "@/api/apijobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import JobCard from "@/components/Job-Card";
import { useNavigate } from "react-router-dom";

const SavedJob = () => {
  const {
    data: savedJobs,
    error: savedJobError,
    loading: savedJobLoading,
    fn: getSavedJobFn,
  } = useFetch(getSavedJobs);

  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) getSavedJobFn();
    console.log(savedJobs);
  }, [isLoaded]);

  if (savedJobLoading || !isLoaded)
    return (
      <p className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
        Loading...
      </p>
    );

    if(isLoaded && user?.unsafeMetadata?.role !== 'candidate')
      navigate('/my-jobs')
    
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedJobs?.length ? (
        savedJobs.map((job) => {
          return <JobCard key={job.id} job={job.job} isSavedCard={true} onJobSave={getSavedJobFn}/>;
        })
      ) : (
        <p className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
          No saved jobs Found...
        </p>
      )}
    </div>
      {savedJobError && (
        <p className="w-[100%] text-red-500 mb-4 font-bold text-2xl text-center">{`Error fetching saved jobs ${savedJobError}`}</p>
      )}
    </div>
  );
};

export default SavedJob;
