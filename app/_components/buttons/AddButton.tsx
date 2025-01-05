import { PlusIcon } from '@heroicons/react/24/solid'
import clsx from "clsx";

type Props = {
  size?: "sm" | "md" | "lg",
  label?: string,
  disabled?: boolean,
  className?: string
}

export function AddButton({ size = "md", label = "追加", disabled = false, className = "" }: Props) {

  return (
    <button
      type='submit'
      disabled={disabled}
      className={clsx(
        "flex items-center group font-bold text-primary hover:text-accent",
        className,
        {
          "text-sm": size === "sm",
          "text-md": size === "md",
          "text-lg": size === "lg"
        },
      )}
    >
      <PlusIcon
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