import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { USER_API_END_POINT } from '@/utils/constant';
import { setLoading } from '@/redux/authSlice';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    profilePhoto: null,
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handles text/radio inputs
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // Handles file input
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0] || null;
    setInput((prev) => ({ ...prev, profilePhoto: file }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { fullname, email, phoneNumber, password, role, profilePhoto } = input;

    // Basic validation
    if (!fullname || !email || !phoneNumber || !password || !role) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);
      formData.append('password', password);
      formData.append('role', role);

      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
        console.log('Uploading file:', profilePhoto.name, profilePhoto.type, profilePhoto.size);
      }

      // Debug: Log all form data entries before sending
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Signup successful!');
        navigate('/login');
      } else {
        toast.error(res.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err?.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-gray-200 rounded-md p-6 my-10"
          encType="multipart/form-data"
        >
          <h1 className="font-bold text-2xl mb-6 text-center">Sign Up</h1>

          <div className="mb-4">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Dhruv Patel"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="patel@gmail.com"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="8080808080"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="********"
              required
            />
          </div>

          <RadioGroup className="flex items-center gap-6 mb-6 justify-center">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="student"
                name="role"
                value="student"
                checked={input.role === 'student'}
                onChange={changeEventHandler}
                required
              />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="recruiter"
                name="role"
                value="recruiter"
                checked={input.role === 'recruiter'}
                onChange={changeEventHandler}
                required
              />
              <Label htmlFor="recruiter">Recruiter</Label>
            </div>
          </RadioGroup>

          <div className="mb-6 flex items-center gap-4">
            <Label htmlFor="profilePhoto">Profile Image</Label>
            <Input
              id="profilePhoto"
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer"
            />
          </div>

          {loading ? (
            <Button className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Signup
            </Button>
          )}

          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
