import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { pathname } = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setCheckingAuth(false);
    }
  }, [isLoaded]);

  if (checkingAuth) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" replace />;
  }

  if (!user?.unsafeMetadata?.role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
