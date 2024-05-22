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
      <div className='flex flex-col items-start mb-4'>
        <label className='pl-5' htmlFor="semester">Semester</label>
        <select
          className='text-black mb-8 mt-2 w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="semester"
          value={semester}
          onChange={handleSemesterChange}
        >
          <option value="">Select Semester</option>
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
          <option value="Semester 3">Semester 3</option>
          <option value="Semester 4">Semester 4</option>
          <option value="Semester 5">Semester 5</option>
          <option value="Semester 6">Semester 6</option>
          <option value="Semester 7">Semester 7</option>
          <option value="Semester 8">Semester 8</option>
        </select>
      </div>
    </div>
  );
}

export default Semester;
