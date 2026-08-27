interface DepartmentProps {
  departments: readonly string[];
  selectedDepartment?: string;
  onSelectDepartment: (department: string) => void;
}

export const Department = ({
  departments,
  selectedDepartment,
  onSelectDepartment,
}: DepartmentProps) => {
  return (
    <div className='max-h-[36rem] overflow-y-auto overscroll-contain'>
      {departments.map((department, index) => {
        const isSelected = department === selectedDepartment;

        return (
          <button
            key={`${department}-${index}`}
            type='button'
            aria-pressed={isSelected}
            className={`text-medium-15 flex w-full items-center border-b border-gray-200 px-[1.2rem] py-[1.6rem] text-left ${
              isSelected
                ? 'bg-primary text-white-800'
                : 'text-gray-800'
            }`}
            onClick={() => onSelectDepartment(department)}>
            {department}
          </button>
        );
      })}
    </div>
  );
};
