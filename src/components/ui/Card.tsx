import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white border-2 border-[var(--color-ink)]
        shadow-[var(--shadow-brutal)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        px-6 py-4 border-b-2 border-[var(--color-ink)]
        bg-[var(--color-cream)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        px-6 py-4 border-t-2 border-[var(--color-ink)]
        bg-[var(--color-cream)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
