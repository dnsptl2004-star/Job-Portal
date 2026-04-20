import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>
          {allAppliedJobs.length > 0
            ? 'A list of your applied jobs'
            : 'No jobs applied yet.'}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-sm text-gray-500">
                You haven't applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>
                  {appliedJob?.createdAt
                    ? formatDate(appliedJob.createdAt)
                    : 'N/A'}
                </TableCell>
                <TableCell>{appliedJob?.job?.title || 'Unknown'}</TableCell>
                <TableCell>{appliedJob?.job?.company?.name || 'Unknown'}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      appliedJob?.status === 'rejected'
                        ? 'bg-red-400'
                        : appliedJob?.status === 'pending'
                        ? 'bg-gray-400'
                        : 'bg-green-400'
                    }
                  >
                    {appliedJob?.status?.toUpperCase() || 'UNKNOWN'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
