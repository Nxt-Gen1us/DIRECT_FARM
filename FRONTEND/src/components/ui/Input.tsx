import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

const field =
  "w-full rounded-2xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-accent aria-[invalid=true]:border-primary aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-primary/15";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, className)} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(field, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(field, className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-medium uppercase tracking-wider text-muted">
        <span>{label}</span>
        {optional && (
          <span className="normal-case tracking-normal text-[10px]">{t("register.optional")}</span>
        )}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-primary" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
