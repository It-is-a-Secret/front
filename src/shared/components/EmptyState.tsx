interface EmptyStateProps {
  image: React.ReactNode;
  title?: React.ReactNode;
  highlightTitle?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  imageClassName?: string;
}

export const EmptyState = ({
  image,
  title,
  highlightTitle,
  description,
  className = '',
  imageClassName = '',
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className={`${imageClassName}`}>{image}</div>

      {title && (
        <h2 className='text-title-22b whitespace-pre-line text-gray-800'>
          {title}
        </h2>
      )}

      {highlightTitle && (
        <h2 className='text-title-22b text-primary whitespace-pre-line'>
          {highlightTitle}
        </h2>
      )}

      {description && (
        <p className='text-body1-15r mt-[1.5rem] whitespace-pre-line text-gray-600'>
          {description}
        </p>
      )}
    </div>
  );
};
