import React from 'react';

interface SwissGridProps {
  children: React.ReactNode;
  className?: string;
}

export const SwissGrid: React.FC<SwissGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 ${className}`}>
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  colSpan?: number; // Mobile default
  mdColSpan?: number;
  lgColSpan?: number;
  className?: string;
}

export const GridItem: React.FC<GridItemProps> = ({ 
  children, 
  colSpan = 4, 
  mdColSpan, 
  lgColSpan, 
  className = '' 
}) => {
  const getSpanClass = (span: number, prefix: string = '') => {
    return `${prefix}col-span-${span}`;
  };

  const spanClasses = [
    getSpanClass(colSpan),
    mdColSpan ? getSpanClass(mdColSpan, 'md:') : '',
    lgColSpan ? getSpanClass(lgColSpan, 'lg:') : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${spanClasses} ${className}`}>
      {children}
    </div>
  );
};