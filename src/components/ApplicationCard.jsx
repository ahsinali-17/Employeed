import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
  Trash2,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteApplication, updateApplication } from "@/api/apiApplications";

const ApplicationCard = ({ jobFn, application, isCandidate = false }) => {
  const {
    data: updatedApplicationData,
    loading: updatingApplicationLoading,
    fn: updateApplicationFn,
  } = useFetch(updateApplication, { job_id: application.job_id });

  const {
    data: delAppData,
    loading: delAppLoading,
    fn: delAppFn,
  } = useFetch(deleteApplication);

  const handleApplicationStatus = async (value) => {
    updateApplicationFn(value).then(() => jobFn());
  };

  return (
    <div>
      {updatingApplicationLoading && (
        <p className="w-[100%] text-sky-500 mb-4 text-xl text-center">
          Updating Status...
        </p>
      )}
      <Card className="border-y-2 border-x-0 border-white">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : `${application.name}`}
          </CardTitle>
          <div className="flex gap-4 items-center">
            <a href={application?.resume} target="_blank">
              <Download className="bg-white text-black w-8 h-8 p-3 rounded-full cursor-pointer" />
            </a>
            {isCandidate && (
              <Trash2
                fill=""
                stroke="white"
                size={24}
                className={`text-red-300  ${
                  delAppLoading
                    ? "opacity-50 cursor-progress"
                    : "opacity-100 cursor-pointer"
                }`}
                onClick={() => {
                  delAppFn(application.id).then(() => jobFn());
                }}
              ></Trash2>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={15} /> {application.experience} years of
              experience
            </div>
            <div className="flex items-center gap-3">
              <School size={15} /> {application.education}{" "}
            </div>
            <div className="flex items-center gap-3">
              <Boxes size={15} />
              Skills: {application.skills}
            </div>
          </div>
          <hr />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span>{new Date(application?.created_at).toLocaleString()}</span>
          {isCandidate ? (
            <span className="capitalize font-bold">
              Status: {application.status}
            </span>
          ) : (
            <>
              <Select
                onValueChange={handleApplicationStatus}
                defaultValue={application.status}
              >
                <SelectTrigger
                  className={`md:w-[180px] ${
                    application.status === "applied"
                      ? "bg-gray-500"
                      : application.status === "interviewing"
                      ? "bg-yellow-500"
                      : application.status === "hired"
                      ? "bg-green-700"
                      : "bg-red-700"
                  }`}
                >
                  <SelectValue placeholder="Application Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationCard;
