import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: ReactNode;
  isPassword?: boolean;
  isEmail?: boolean
};

export default function InputWithIcon({
  label,
  placeholder,
  value,
  onChange,
  leftIcon,
  isPassword = false,
  isEmail = false,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : isEmail ? "email" : "text"

  return (
    <div className="mb-4">
      <Label className="mb-1 text-sm font-medium text-white">
        {label}
      </Label>

      <div className="flex items-center border border-gray-700 rounded-md px-3 bg-gray-900 shadow-sm">
        {/* Icon kiri */}
        {leftIcon && <div className="text-gray-500 mr-2">{leftIcon}</div>}

        {/* Input */}
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none border-0 .focus:ring-0 focus-visible:ring-0 focus-visible:border-0 text-sm text-white placeholder-gray-400 bg-gray-900"
        />

        {/* Icon kanan (show/hide password) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-2 text-gray-500 hover:text-gray-700 transition-transform duration-150"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
