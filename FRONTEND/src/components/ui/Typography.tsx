import React from 'react';
import { cn } from '../../lib/cn';

/* Hero Heading - Use for landing page and major section headings */
export function HeroHeading({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <h1 className={cn('text-hero', className)}>{children}</h1>;
}

/* Page Title - Use for main page headings */
export function PageTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <h1 className={cn('text-page-title', className)}>{children}</h1>;
}

/* Section Title - Use for section headings */
export function SectionTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <h2 className={cn('text-section-title', className)}>{children}</h2>;
}

/* Card Title - Use for card headings */
export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <h3 className={cn('text-card-title', className)}>{children}</h3>;
}

/* Body Text - Use for regular paragraphs */
export function BodyText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <p className={cn('text-body', className)}>{children}</p>;
}

/* Muted Text - Use for secondary information */
export function MutedText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <p className={cn('text-body text-muted', className)}>{children}</p>;
}

/* Caption Text - Use for metadata and small text */
export function Caption({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <span className={cn('text-caption', className)}>{children}</span>;
}

/* Helper Text - Use for form helper text */
export function HelperText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <span className={cn('text-helper', className)}>{children}</span>;
}

/* Error Text - Use for error messages */
export function ErrorText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <span className={cn('text-error', 'text-color-danger', className)}>{children}</span>;
}

/* Label - Use for form labels */
export function Label({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return <label className={cn('text-label', className)}>{children}</label>;
}
