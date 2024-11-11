import React,{useState,useEffect} from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/useFetch";
import { deleteJob, saveJob } from "@/api/apijobs";
import { useUser } from "@clerk/clerk-react";
import { HeartIcon, MapPinIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const JobCard = ({ job, isMyJob = false, isSavedCard, onJobSave =()=>{}, jobFn = ()=>{} }) => { //no definition of onJobSave in the whole structue so have to define it as empty function.
  const { user } = useUser();
  const [saved, setsaved] = useState(isSavedCard)

  const {
    loading: savedJobLoading,
    fn: savedJobFn,
  } = useFetch(saveJob,{isAlreadySaved: saved});

  const {
    loading: delJobLoading,
    fn: delJobFn,
    error: delJobError,
  } = useFetch(deleteJob);
  
  const handleSaveJob = async () => {
    await savedJobFn({ job_id: job.id, user_id: user.id });
    onJobSave()
    setsaved(!saved)
  };

  return (
    <Card className="mb-3 bg-slate-600 w-[95%] mx-auto flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2
              fill="none"
              stroke="white"
              size={24}
              className={`text-red-300  ${delJobLoading? "opacity-50 cursor-progress":"opacity-100 cursor-pointer"}`}
              onClick={() => {
                 delJobFn(job.id).then(()=>jobFn());

              }}
            ></Trash2>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          {job.company && (
            <img
              src={job.company.logo_url}
              alt={job.company.name}
              className="h-6"
            />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} className="text-sky-500" />
            <span className="text-gray-400 text-sm sm:text-md">
              {job.location}
            </span>
          </div>
        </div>
        <hr />
        <p>
          {job.description.length > 30 ? job.description.substring(0,30) + "..." : job.description}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            View Job
          </Button>
        </Link>
        {!isMyJob && user?.unsafeMetadata?.role === "candidate" && (
          <Button
            variant="outline"
            className="w-16"
            onClick={handleSaveJob}
            disabled={savedJobLoading}
          >
            {saved ?<HeartIcon stroke="red" fill="red" />: <HeartIcon stroke="red"/>}
          </Button>
        )}
        
      </CardFooter>
    </Card>
  );
};

export default JobCard;
