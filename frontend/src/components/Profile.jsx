import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, LogOut } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector, useDispatch } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "/D_Profile.png";

const Profile = () => {
  useGetAppliedJobs();

  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasResume = Boolean(user?.profile?.resume);
  const avatarSrc = user?.profile?.profilePhoto?.trim() || DEFAULT_AVATAR;
  const skills = Array.isArray(user?.profile?.skills) ? user.profile.skills : [];

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error("Logout failed. Try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto flex justify-end gap-2 mt-5 px-4">
        <Button onClick={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-sm">
        <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border">
              <AvatarImage
                src={avatarSrc}
                alt={user?.fullname || "profile"}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </Avatar>

            <div>
              <h1 className="font-medium text-xl">
                {user?.fullname || "NA"}
              </h1>
              <p className="text-gray-600">
                {user?.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>

          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <div className="my-6 space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4" />
            <span>{user?.email || "NA"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Contact className="h-4 w-4" />
            <span>{user?.phoneNumber || user?.profile?.phoneNumber || "NA"}</span>
          </div>
        </div>

        <div className="my-6">
          <h2 className="font-semibold mb-2">Skills</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {skills.length > 0 ? (
              skills.map((skill, idx) => (
                <Badge key={idx} className="px-3 py-1">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">NA</span>
            )}
          </div>
        </div>

        <div className="grid w-full max-w-sm items-start gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {hasResume ? (
            <a
              href={user.profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 w-full hover:underline cursor-pointer break-all"
            >
              {user.profile.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span className="text-gray-500">NA</span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl my-5 p-5 shadow-sm">
        <h1 className="font-bold text-lg mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;