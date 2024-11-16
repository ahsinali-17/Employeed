import { getJob, updateJobStatus } from '@/api/apijobs';
import { useUser } from '@clerk/clerk-react'
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import useFetch from "@/hooks/useFetch";
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplyjobDrawer from '@/components/ApplyJob';
import ApplicationCard from '@/components/ApplicationCard';

const Job = () => {
  const {isLoaded, user} = useUser();
  const {id} = useParams();

  const {
    data: jobData,
    loading: jobLoading,
    fn: JobFn,
  } = useFetch(getJob, { job_id: id });

  const {
    loading: updatedJobLoading,
    fn: updateJobFn,
  } = useFetch(updateJobStatus, { job_id: id });

  useEffect(() => {
    if(isLoaded) JobFn();
  },[isLoaded])

  const handleJobStatus = async (value) => {
    let isOpen = value ==='open';
    await updateJobFn(isOpen);
    await JobFn();
  }

  if (!isLoaded || jobLoading)
    return (
      <div className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
        Loading...
      </div>
    );
  return (
    <div className='flex flex-col gap-8 mt-5 px-6'>
      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-6 '>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{jobData?.title}</h1>
        <img src={jobData?.company?.logo_url} alt={jobData?.company?.name} className='h-8' />
      </div>

      <div className='flex justify-between'>
      <div className='flex gap-2'>
        <MapPinIcon stroke='skyblue'/>
        {jobData?.location}
      </div>

      <div className='flex gap-2'>
        <BriefcaseIcon stroke='green'/>
        {jobData?.applications?.length} applicants
      </div>

      <div className='flex gap-2'>
        {jobData?.isOpen ?<><DoorOpen stroke='green'/>Opened</>:<><DoorClosed stroke='red'/>Closed</>}
      </div>
      </div>

      {/*job status*/}
      {updatedJobLoading && <div className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
        Loading...
      </div>}
      {(jobData?.recruiter_id === user.id && user.unsafeMetadata.role === 'recruiter') && 
        <Select onValueChange={handleJobStatus}>
      <SelectTrigger className={`md:w-[180px] ${jobData?.isOpen?"bg-green-700":"bg-red-600"}`}>
        <SelectValue placeholder={`Hiring ${jobData?.isOpen ? "Open":"closed"}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open" >Open</SelectItem>
        <SelectItem value="closed" >Closed</SelectItem>
      </SelectContent>
    </Select>
      }
      <h2 className='text-2xl sm:text-3xl font-bold'>About the Job</h2>
      <p className='sm:text-lg'>{jobData?.description}</p>
      <h2 className='text-2xl sm:text-3xl font-bold'>what are we looking for?</h2>
      <MDEditor.Markdown source={jobData?.requirements} className='bg-transparent sm:text-lg'/>

      {
        jobData?.applications?.length > 0 && jobData.recruiter_id === user.id && user?.unsafeMetadata?.role==="recruiter" && <div>
          <h2 className='text-2xl sm:text-3xl font-bold mb-3'>Applications</h2>
          <div className='flex flex-col gap-2'>
          {jobData?.applications.map((app)=>{
               return <div key={app.id}><ApplicationCard jobFn={JobFn} application={app} /></div>
          })}
          </div>
        </div>
        }

      {/* rendering applications */}
      <div className='flex justify-center'>
      {(user.unsafeMetadata.role !== 'recruiter') && <ApplyjobDrawer
      jobData={jobData} user={user} fetchJob={JobFn} isApplied = {jobData?.applications?.find((app)=> app.candidate_id === user.id) ?true:false}
      />}
      </div>

      
    </div>
  )
}

export default Job