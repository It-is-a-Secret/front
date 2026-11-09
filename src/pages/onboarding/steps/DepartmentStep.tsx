import {useMemo, useState} from 'react';

import {Department} from '@/pages/onboarding/components/Department';
import {DEPARTMENTS} from '@/pages/onboarding/constants/constants';
import {filterDepartments} from '@/pages/onboarding/utils/filter-departments';
import {Input} from '@/shared/components/Input';
import {IcSvgSearch} from '@/shared/icons';

interface DepartmentStepProps {
  department: string;
  onDepartmentChange: (department: string) => void;
}

export const DepartmentStep = ({
  department,
  onDepartmentChange,
}: DepartmentStepProps) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const filteredDepartments = useMemo(
    () => filterDepartments(DEPARTMENTS, searchKeyword),
    [searchKeyword]
  );

  return (
    <div className='mt-[3rem] flex flex-col gap-[2rem]'>
      <p className='text-h1-22sb'>어느 학과이신가요?</p>

      <Input
        value={searchKeyword}
        onChange={(event) => setSearchKeyword(event.target.value)}
        placeholder='학과 검색'
        leftItem={<IcSvgSearch className='size-[2rem] text-gray-400' />}
      />

      <Department
        departments={filteredDepartments}
        selectedDepartment={department}
        onSelectDepartment={onDepartmentChange}
      />
    </div>
  );
};
