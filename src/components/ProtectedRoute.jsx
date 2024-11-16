import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const{user,isSignedIn,isLoaded}=useUser()
    const {pathname} = useLocation()  //get the current path after the domain name
    if(isLoaded && !isSignedIn && isSignedIn!==undefined){
      alert(isLoaded + isSignedIn)
     return <Navigate to='/?sign-in=true'/>
    }

    //check onboarding status
    if(user !== undefined && !user?.unsafeMetadata?.role && pathname !== '/onboarding'){
      return <Navigate to = '/onboarding'/>
    }
  return children

}

export default ProtectedRoute