import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { UserButton, SignedIn, SignedOut, SignIn, useUser} from "@clerk/clerk-react";
import { BriefcaseBusinessIcon, Heart, PenBox } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [showSignIn, setshowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams(); //returns an object with all the query params
  const {user} = useUser()
  const {pathname} = useLocation()

  useEffect(() => {
    if (search.get("sign-in")) setshowSignIn(true);
  }, [search]);
  return (
    <>
      <nav className="p-4 flex justify-between items-center">
        <Link>
          <img src="/logo.png" alt="logo" className="h-20" />
        </Link>
        <div className="flex gap-8">
          <SignedOut>
            <Button
              variant="outline"
              onClick={() => {
                setshowSignIn(true);
                setSearch({});
              }}
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && <Link to="/post-job">
              <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2" />
                Post a Job
              </Button>
            </Link>}
            {pathname !== '/onboarding' &&
            <Button variant="primary" className="rounded-full" onClick={async()=>{await user.update({unsafeMetadata:{}});}}>
                Switch Role
              </Button>
}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My jobs"
                  labelIcon={
                    <BriefcaseBusinessIcon size={15}/>
                  }
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved jobs"
                  labelIcon={
                    <Heart size={15}/>
                  }
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setshowSignIn(false); //e.target: the element that was clicked on, e.currentTarget: the element that the event listener is attached to
          }}
        >
          <SignIn
          fallbackRedirectUrl= "/onboarding"
          signUpForceRedirectUrl= "/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
