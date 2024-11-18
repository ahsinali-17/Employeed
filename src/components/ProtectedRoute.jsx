import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useState,useEffect } from 'react'

const ProtectedRoute = ({children}) => {
    const{user,isSignedIn,isLoaded}=useUser()
    const {pathname} = useLocation()  //get the current path after the domain name
    const [redirect,setRedirect] = useState(false)

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        // Delay redirect by a short duration to allow for state update.
        const timeout = setTimeout(() => {
          setRedirect(true);
        }, 200); // Adjust delay as needed.
  
        return () => clearTimeout(timeout);
      }
    }, [isLoaded, isSignedIn]);
  
    if (redirect) {
      return <Navigate to="/?sign-in=true" />;
    }
  
    // Check onboarding status
    if (user!==undefined && !user?.unsafeMetadata?.role && pathname !== '/onboarding') {
      return <Navigate to="/onboarding" />;
    }
    
  return children

}

export default ProtectedRoute