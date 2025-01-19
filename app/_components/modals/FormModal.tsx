import clsx from "clsx";
import { useEffect, useRef } from "react";
import { LoadingDots } from "../common/LoadingDots";

export function FormModal({
  children,
  isOpen,
  modalClose,
  title,
  text,
  className,
  isSubmitting,
}: {
  children: React.ReactNode,
  isOpen: boolean,
  modalClose: () => void,
  title?: string,
  text?: string,
  className?: string,
  isSubmitting?: boolean,
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialog.current?.showModal();
    }
    if (!isOpen) {
      dialog.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialog} className="modal w-screen h-screen">
      {isSubmitting && <LoadingDots />}
      <div className={clsx("modal-box text-center text-base-content bg-base-100 border-base-content border", className)}>
        {title && (
          <h3 className="font-bold text-lg mb-4">{title}</h3>
        )}
        {text && (
          <p className="mb-4">
            {text}
          </p>
        )}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" type="button" onClick={modalClose} >✕</button>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          type="button"
          onClick={modalClose}
        >
          close
        </button>
      </form>
    </dialog>
  );
}
