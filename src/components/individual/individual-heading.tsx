import React from 'react';

interface HeadingIndividualProps {
  title: string;
  description?: string;
  icon?: React.ReactElement; // The icon element itself, with its color already set
  titleClassName?: string;   // Optional override for title class
  descriptionClassName?: string; // Optional override for description class
}

const HeadingIndividual: React.FC<HeadingIndividualProps> = ({ 
  title, 
  description, 
  icon,
  titleClassName,
  descriptionClassName 
}) => {
  // Default dark text for light backgrounds, light text for dark mode
  const defaultTitleClass = "text-slate-800 dark:text-slate-100";
  const defaultDescriptionClass = "text-slate-600 dark:text-slate-400";

  return (
    <div className="mb-6 md:mb-8"> {/* Standard bottom margin */}
      <div className="flex items-center gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>} {/* Icon is rendered directly */}
        <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${titleClassName || defaultTitleClass}`}>
          {title}
        </h2>
      </div>
      {description && (
        <p className={`text-sm md:text-base mt-1.5 ${descriptionClassName || defaultDescriptionClass}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default HeadingIndividual;
