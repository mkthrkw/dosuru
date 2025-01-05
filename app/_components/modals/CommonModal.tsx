import { useRouter } from "next/navigation";
import { LoadingDots } from "../common/LoadingDots";

export function CommonModal({
  children,
  dialog,
  title,
  text,
  addClass,
  isSubmitting,
}: {
  children: React.ReactNode,
  dialog: React.RefObject<HTMLDialogElement | null>,
  title?: string,
  text?: string,
  addClass?: string,
  isSubmitting?: boolean,
}) {
  const router = useRouter();
  const closeHandler = () => {
    if (dialog?.current) {
      dialog.current.close();
      router.refresh()
    }
  }

  return (
    <dialog className="modal w-screen h-screen" ref={dialog}>
      {isSubmitting && <LoadingDots />}
      <div className={"modal-box text-center text-base-content bg-base-100 border-base-content border" + ' ' + addClass}>
        {title && (
          <h3 className="font-bold text-lg mb-4">{title}</h3>
        )}
        {text && (
          <p className="mb-4">
            {text}
          </p>
        )}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeHandler} >✕</button>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          onClick={closeHandler}
        >
          close
        </button>
      </form>
    </dialog>
  );
}
