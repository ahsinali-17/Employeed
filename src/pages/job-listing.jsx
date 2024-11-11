import React, { useEffect, useState } from "react";
import { getJobs } from "@/api/apijobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import JobCard from "@/components/Job-Card";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { State} from "country-state-city";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Delete, DeleteIcon, Filter, FilterX } from "lucide-react";


const JobListing = () => {
  const { isLoaded } = useUser();
  const [location, setlocation] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setpage] = useState(0)

  const {
    data: jobsData,
    loading: jobLoading,
    fn: JobFn,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const {
    data: ComData,
    fn: ComFn,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) JobFn();
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded) ComFn();
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let query = formData.get("search-query");
    if (query) setSearchQuery(query);
  }

  if (!isLoaded)
    return (
      <div className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
        Loading...
      </div>
    );

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/*filters*/}
      <form onSubmit={handleSearch} className="flex h-14 w-full gap-4 px-4 mb-3">
        <Input type="text" placeholder="Search jobs by Title..." name="search-query" className="h-full flex-1 px-4 text-md items-center"/>
        <Button type="submit" className="h-full sm:w-28" variant="primary">Search</Button>
      </form>

      <div className="px-4 flex flex-col md:flex-row gap-4 items-center">
        
      <Select onValueChange={(value)=>{setlocation(value)}}>
      <SelectTrigger className="md:w-[180px]">
        <SelectValue placeholder="Select a Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {State.getStatesOfCountry('PK').map(({name})=>{return <SelectItem key={name} value={name}>{name}</SelectItem>})}
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select onValueChange={(value)=>{setCompanyId(value)}}>
      <SelectTrigger className="md:w-[180px]">
        <SelectValue placeholder="Select a Company" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ComData?.length && ComData.map((company)=>{return <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>})}
        </SelectGroup>
      </SelectContent>
    </Select>
    <Button onClick={()=>{setlocation("");setCompanyId("");setSearchQuery("")}} variant="destructive" className=""><FilterX/></Button>
      </div>

      {jobLoading && (
        <div className="w-full text-sky-500 my-4 px-16 font-bold text-xl">
          Loading...
        </div>
      )}
      {jobLoading === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobsData?.length ? (
            jobsData.slice(page*6,(page*6)+6).map((job) => {
              return <JobCard key={job.id} job={job} isSavedCard={job?.saved?.length >0}/>;
            })
          ) : (
            <div className="text-center"> No jobs found 😔</div>
          )}
        </div>
      )}
      
{jobsData?.length > 5 && <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious 
        href="#"
        onClick={() => page > 0 && setpage(page - 1)}
        className={`${page === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" onClick={() => setpage(0)}>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" className={`${7 > jobsData.length ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} onClick={() => setpage(1)}>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>

    <PaginationItem>
      <PaginationNext 
        href="#" 
        onClick={() => (page + 1) * 6 < jobsData.length && setpage(page + 1)}
        className={`${((page + 1) * 6 >= jobsData.length) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
}

    </div>
  );
};

export default JobListing;
