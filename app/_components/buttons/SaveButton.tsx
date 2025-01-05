import { CheckIcon } from '@heroicons/react/24/solid';
import clsx from "clsx";

type Props = {
  size?: "sm" | "md" | "lg",
  label?: string,
  disabled?: boolean,
  className?: string
}

export function SaveButton({ size = "md", label = "保存", disabled = false, className = "" }: Props) {

  return (
    <button
      type='submit'
      disabled={disabled}
      className={clsx(
        "flex items-center font-bold text-primary group hover:text-accent",
        className,
        {
          "text-sm": size === "sm",
          "text-md": size === "md",
          "text-lg": size === "lg"
        }
      )}
    >
      <CheckIcon
        className={clsx(
          {
            "w-5 h-5": size === "sm",
            "w-8 h-8": size === "md",
            "w-11 h-11": size === "lg"
          }
        )}
      />
      {label}
    </button>
  )
}