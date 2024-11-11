import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useFetch from '@/hooks/useFetch'
import { addCompanies } from '@/api/apiCompanies'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const schema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    logo: z.any().refine((file) =>
        file[0] &&
        (file[0].type === "image/png" ||
          file[0].type === "image/jpeg") ,
      { message: "Only images are allowed" })
})
const AddComDrawer = ({comFn}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const {
      data: addedComData,
      loading: addComLoading,
      fn: addComFn,
      error: addComError,
    } = useFetch(addCompanies);

    const onCompSubmit = (data) => {
      console.log(data);
      addComFn({...data, logo: data.logo[0] }).then(() =>{comFn(); reset();});
    };

  return (
    <div>
        <Drawer>
            <DrawerTrigger asChild>
              <Button size="sm" variant="secondary">
                Add Company
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add a New Company</DrawerTitle>
                <DrawerDescription>
                  Add a new company to the list
                </DrawerDescription>
              </DrawerHeader>

              <form
                className="w-full flex items-center gap-4 p-4 pb-0"
              >
                <Input
                  type="text"
                  placeholder="Company Name"
                  className=""
                  {...register("name")}
                />
               
                <div className="flex flex-col gap-4">
                <Input
                  type="file"
                  placeholder="Company Logo"
                  accept=".jpeg, .jpg, .png"
                  className="file:text-gray-500"
                  {...register("logo")}
                />
               
                 </div>
                 
                 
                <Button
                  type="button"
                  onClick = {handleSubmit(onCompSubmit)}
                  variant="primary"
                  className="w-40"
                >
                 {addComLoading?"Adding...": "Add"}
                </Button>
              </form>
              {addComError && <p className="text-red-500">{addComError.message}</p>}
              {errors.logo && (
                  <p className="text-red-500">{errors.logo.message}</p>
                )}
                 {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
    </div>
  )
}

export default AddComDrawer