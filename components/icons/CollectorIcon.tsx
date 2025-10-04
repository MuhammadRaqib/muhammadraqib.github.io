
import React from 'react';

export const CollectorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2.707a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-.707.293H17" />
  </svg>
);
