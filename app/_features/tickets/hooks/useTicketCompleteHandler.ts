import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { updateTicketCompleted } from "../actions";
import { TicketComment } from "@/app/_util/types/nestedType";

export function useTicketCompleteHandler({
  modalProps,
  stateUpdateFunction,
}: {
  modalProps: TicketComment | null;
  stateUpdateFunction?: (args: { [key: string]: boolean }) => void;
}) {
  const [completed, setCompleted] = useState(modalProps?.completed ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const message = `このチケットを${completed ? "未完了" : "完了"}しますか？`;
      if (!modalProps || !window.confirm(message)) {
        event?.preventDefault();
        return;
      }
      setIsSubmitting(true);
      const result = await updateTicketCompleted(!completed, modalProps.id);
      if (result.state === "resolved") {
        setCompleted(!completed);
        if (stateUpdateFunction) {
          stateUpdateFunction({ completed: !completed });
        }
      } else if (result.state === "rejected") {
        toast.error(result.message || "An error occurred", {
          autoClose: 3000,
        });
      }
      setIsSubmitting(false);
    },
    [completed, modalProps, stateUpdateFunction],
  );

  return { completed, setCompleted, handleToggle, isSubmitting };
}
