import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { State } from "country-state-city";
import useFetch from "@/hooks/useFetch";
import { getCompanies } from "@/api/apiCompanies";
import { insertJob } from "@/api/apijobs";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import AddComDrawer from "@/components/AddComDrawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
  location: z.string().min(1, { message: "Location cannot be empty" }),
  company_id: z.string().min(1, { message: "Company id cannot be empty" }),
  requirements: z.string().min(1, { message: "Requirements cannot be empty" }),
});
const PostJob = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    data: ComData,
    loading: ComLoading,
    fn: ComFn,
  } = useFetch(getCompanies);

  const {
    data: addedJobData,
    loading: addJobLoading,
    fn: addJobFn,
    error: addJobError,
  } = useFetch(insertJob);

  useEffect(() => {
    if (isLoaded) ComFn();
  }, [isLoaded]);

  useEffect(() => {
    if (addedJobData?.length > 0){ 
      navigate(`/my-jobs`);}
  }, [addJobLoading]);

  const onSubmit = async (data) => {
    addJobFn({ ...data, isOpen: true, recruiter_id: user.id }).then(() =>
      reset()
    );
  };

  if (isLoaded && user?.unsafeMetadata?.role !== "recruiter" ) {
    return <Navigate to="/jobs" />;
  }
  if (!isLoaded || ComLoading)
    return (
      <div className="w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center">
        Loading...
      </div>
    );

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Textarea placeholder="Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="w-[90vw] mx-auto flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("PK").map(({ name }) => {
                      return (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a Company">
                    {field.value
                      ? ComData.find((company) => company.id == field.value)
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ComData?.length &&
                      ComData.map((company) => {
                        return (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        );
                      })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {/* Add a company */}
          <AddComDrawer comFn={ComFn}/>

        </div>

        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <h2 className="mt-3 text-2xl font-bold gradient-title">Requirements:</h2>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {addJobError && <p className="text-red-500">{addJobError.message}</p>}
        <Button type="submit" variant="primary" className="mt-2" size="lg">
          {addJobLoading ? "Submitting" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
