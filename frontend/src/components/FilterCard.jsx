import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();

  // Stores selected values by category
  const [filters, setFilters] = useState({
    Location: '',
    Industry: '',
    Salary: ''
  });

  const handleChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Dispatch whenever filters change
  useEffect(() => {
    const activeFilters = Object.values(filters).filter(Boolean);
    const query = activeFilters.join(' ');
    dispatch(setSearchedQuery(query));
  }, [filters, dispatch]);

  return (
    <div className="w-full bg-white p-5 rounded-md shadow-md">
      <h1 className="font-bold text-xl mb-4">Filter Jobs</h1>
      <hr className="mb-4" />

      {filterData.map((section, index) => (
        <div key={index} className="mb-5">
          <h2 className="font-semibold text-lg mb-2">{section.filterType}</h2>
          <RadioGroup
            value={filters[section.filterType]}
            onValueChange={(val) => handleChange(section.filterType, val)}
          >
            {section.array.map((item, idx) => {
              const itemId = `${section.filterType}-${idx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
