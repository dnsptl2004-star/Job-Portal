import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgo = (createdAt) => {
    if (!createdAt) return 'Unknown';
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = now - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      {/* Top Row: Posted Time + Bookmark */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>{daysAgo(job?.createdAt)}</p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

      {/* Company Info */}
      <div className='flex items-center gap-3 my-3'>
        <Avatar className="w-12 h-12">
          <AvatarImage src={job?.company?.logo || '/default-logo.png'} alt="Company Logo" />
        </Avatar>
        <div>
          <h2 className='font-semibold text-base'>{job?.company?.name || 'Unknown Company'}</h2>
          <p className='text-sm text-gray-500'>{job?.location || 'Location not specified'}</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className='font-bold text-lg mb-1'>{job?.title || 'Job Title'}</h1>
        <p className='text-sm text-gray-600 line-clamp-3'>{job?.description}</p>
      </div>

      {/* Badges: Position, Type, Salary */}
      <div className='flex flex-wrap gap-2 mt-4'>
        {job?.position && (
          <Badge className='text-blue-700 font-bold' variant="ghost">
            {job.position} Position{job.position > 1 ? 's' : ''}
          </Badge>
        )}
        {job?.jobType && (
          <Badge className='text-[#F83002] font-bold' variant="ghost">
            {job.jobType}
          </Badge>
        )}
        {job?.salary && (
          <Badge className='text-[#7209b7] font-bold' variant="ghost">
            {job.salary} LPA
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex items-center gap-4 mt-5'>
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">
          View Details
        </Button>
        <Button className="bg-[#7209b7] text-white">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
