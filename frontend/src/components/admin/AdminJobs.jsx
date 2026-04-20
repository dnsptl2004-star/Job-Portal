import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';

const AdminJobs = () => {
  useGetAllAdminJobs();

  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debounce search input for performance (optional)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setSearchJobByText(input));
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <Input
            type="text"
            className="w-full md:w-1/2"
            placeholder="Search by job title or role"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate('/admin/jobs/create')}>
            + New Job
          </Button>
        </div>

        <AdminJobsTable />
      </main>
    </div>
  );
};

export default AdminJobs;
