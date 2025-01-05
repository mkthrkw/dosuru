import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from "clsx";

type Props = {
  size?: "sm" | "md" | "lg",
  onClick?: () => void,
  label?: string
  className?: string
}

export function CancelButton({ size = "md", onClick, label = "キャンセル", className = "" }: Props) {

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center font-bold text-base-content/40 group hover:text-base-content/80",
        className,
        {
          "text-sm": size === "sm",
          "text-md": size === "md",
          "text-lg": size === "lg"
        }
      )}
    >
      <XMarkIcon
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