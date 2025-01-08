'use client';
import React, { useState } from 'react';

interface SemesterProps {
  semester: string;
  setSemester: (semester: string) => void;
}

const Semester: React.FC<SemesterProps> = ({ semester, setSemester }) => {
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemester(e.target.value);
  };

  return (
    <div>
      <div className='flex flex-col items-start mb-4 font-[Gilroy]'>
        <label className='pl-5' htmlFor="semester">Semester</label>
        <select
          className='text-black border-2 border-gray-700 mb-8 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="semester"
          value={semester}
          onChange={handleSemesterChange}
        >
          <option value="">Select Semester</option>
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
        </select>
      </div>
    </div>
  );
}

export default Semester;
