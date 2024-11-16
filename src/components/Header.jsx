import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusinessIcon, Heart, PenBox } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [showSignIn, setshowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams(); //returns an object with all the query params
  const { user } = useUser();
  const { pathname } = useLocation();
  const [userRole, setUserRole] = useState(user?.unsafeMetadata?.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.unsafeMetadata?.role !== userRole) {
      setUserRole(user?.unsafeMetadata?.role);
    }
  }, [user?.unsafeMetadata?.role]);

  useEffect(() => {
    if (search.get("sign-in")) setshowSignIn(true);
  }, [search]);
  return (
    <>
      <nav className="p-4 flex justify-between items-center">
        <Link>
          <span className="logo gradient-title text-2xl md:text-4xl tracking-tighter italic font-bold">Employeed</span>
          <span className="text-4xl md:text-4xl text-pretty">.</span>
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
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            {pathname !== "/onboarding" && (
              <Button
                variant="primary"
                className="rounded-full"
                onClick={ async () => {
                  await user.update({ unsafeMetadata: {} });
                  if(pathname === "/") {
                    navigate("/onboarding")
                  }
                }}
              >
                Switch Role
              </Button>
            )}
            <UserButton
            key={user?.unsafeMetadata?.role}
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label={user?.unsafeMetadata?.role === "recruiter" ? "My Jobs" : "My Applications"}
                  labelIcon={<BriefcaseBusinessIcon size={15} />}
                  href="/my-jobs"
                />

                {user?.unsafeMetadata?.role === "candidate" && (
                  <UserButton.Link
                    label="Saved jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                )}
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
            fallbackRedirectUrl="/onboarding"
            signUpForceRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
