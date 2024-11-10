import React,{useEffect} from 'react'
import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
const OnBoarding = () => {
  const Navigate = useNavigate()
  const {user,isLoaded} = useUser()
      
  useEffect(() => {
    if(user?.unsafeMetadata?.role)
      Navigate(user.unsafeMetadata.role==='candidate'?'/jobs':'/post-job')
  }, [user])

  const handleRole = async (role) => {
   user.update({unsafeMetadata:{role}}).then(
    ()=>{Navigate(role==='candidate'?'/jobs':'/my-jobs')}
    ).catch((error)=>{console.error("error updating user's role ",error)})
  }
  
  if(!isLoaded)
    return <div className='w-[100%] text-sky-500 mb-4 font-bold text-2xl text-center'>Loading...</div>

  return (
    <div className='flex flex-col justify-center items-center mt-32'>
      <h2 className='gradient-title text-7xl sm:text-8xl tracking-tighter font-extrabold'>I am a...</h2>
      <div className='mt-16 grid grid-cols-2 w-full gap-4 md:px-20'>
         <Button variant="primary" size="xl" onClick={()=>handleRole("candidate")}>Candidate</Button>
          <Button variant="destructive" size="xl" onClick={()=>handleRole("recruiter")}>Recruiter</Button>
      </div>
    </div>
  )
}

export default OnBoarding