import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Field, Input } from "../ui";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  autoComplete = "current-password",
  placeholder,
  error,
  hint,
  required,
  minLength,
  name,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  minLength?: number;
  name?: string;
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} error={error} hint={hint}>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          aria-invalid={Boolean(error)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </Field>
  );
}
