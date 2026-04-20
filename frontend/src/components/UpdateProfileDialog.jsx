import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
    profilePhoto: null,
    resume: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState('');

  useEffect(() => {
    if (user && open) {
      setInput({
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(',') || '',
        profilePhoto: null,
        resume: null,
      });
      setPreviewPhoto(user.profile?.profilePhoto || '');
    }
  }, [user, open]);

  const handleChange = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setInput({ ...input, profilePhoto: file });
      setPreviewPhoto(URL.createObjectURL(file)); // show preview
    } else if (file.type === 'application/pdf') {
      setInput({ ...input, resume: file });
    } else {
      toast.error('Invalid file type');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('bio', input.bio);
    formData.append('skills', input.skills);
    if (input.profilePhoto) formData.append('profilePhoto', input.profilePhoto);
    if (input.resume) formData.append('resume', input.resume);

    try {
      setLoading(true);
      const res = await axios.put(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || 'Profile updated successfully');
        setOpen(false);
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid gap-4 py-4">
            {/* Full Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">Name</Label>
              <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={handleChange} className="col-span-3" />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={input.email} onChange={handleChange} className="col-span-3" />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">Number</Label>
              <Input id="phoneNumber" name="phoneNumber" type="text" value={input.phoneNumber} onChange={handleChange} className="col-span-3" />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Input id="bio" name="bio" type="text" value={input.bio} onChange={handleChange} className="col-span-3" />
            </div>

            {/* Skills */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">Skills</Label>
              <Input id="skills" name="skills" type="text" value={input.skills} onChange={handleChange} placeholder="Comma separated skills" className="col-span-3" />
            </div>

            {/* Profile Photo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profilePhoto" className="text-right">Profile Image</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} />
                {previewPhoto && <img src={previewPhoto} alt="Profile Preview" className="h-24 w-24 object-cover rounded-md" />}
              </div>
            </div>

            {/* Resume */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resume" className="text-right">Resume</Label>
              <Input id="resume" name="resume" type="file" accept="application/pdf" onChange={handleFileChange} className="col-span-3" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full my-4" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
