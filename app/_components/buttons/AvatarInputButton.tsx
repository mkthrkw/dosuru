import { CameraIcon } from "@heroicons/react/24/outline"
import clsx from "clsx";

type Props = {
  size?: "sm" | "md" | "lg",
  onClick?: () => void,
  className?: string
}

export function AvatarInputButton({ size = "md", onClick, className = "" }: Props) {

  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-full bg-slate-700/70 hover:bg-slate-500/70",
        className,
        {
          "w-8 h-8": size === "sm",
          "w-11 h-11": size === "md",
          "w-14 h-14": size === "lg"
        }
      )}
    >
      <CameraIcon
        className={clsx(
          'mx-auto text-slate-300',
          {
            "w-5 h-5": size === "sm",
            "w-8 h-8": size === "md",
            "w-11 h-11": size === "lg"
          }
        )}
      />
    </button>
  )
}