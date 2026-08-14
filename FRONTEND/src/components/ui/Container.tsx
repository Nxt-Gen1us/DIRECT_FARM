import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Container({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("container-app", className)} {...props}>
      {children}
    </div>
  );
}

export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("py-10 md:py-14", className)}>{children}</div>;
}

export function Stack({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}

export function Grid({
  children,
  cols = 3,
  className = "",
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4 | 6;
  className?: string;
}) {
  const map = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };
  return <div className={cn("grid gap-4", map[cols], className)}>{children}</div>;
}
