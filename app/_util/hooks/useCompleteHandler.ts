import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ActionState } from "@/app/_util/types/actionType";

export function useCompleteHandler({
  handleAction,
  fieldName,
  targetId,
  defaultState,
  onSuccess,
  stateUpdateFunction,
}: {
  handleAction: (completed: boolean, targetId: string) => Promise<ActionState>;
  fieldName: string;
  targetId?: string;
  defaultState?: boolean;
  onSuccess?: () => void;
  stateUpdateFunction?: (args: { [key: string]: boolean }) => void;
}) {
  const [completed, setCompleted] = useState(defaultState ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const message = `このチケットを${
        completed ? "未完了" : "完了"
      }しますか？`;
      if (!targetId || !window.confirm(message)) {
        event?.preventDefault();
        return;
      }
      setIsSubmitting(true);
      const result = await handleAction(!completed, targetId);
      if (result.state === "resolved") {
        setCompleted(!completed);
        if (onSuccess) onSuccess();
        if (stateUpdateFunction) {
          stateUpdateFunction({ [fieldName]: !completed });
        }
      } else if (result.state === "rejected") {
        toast.error(result.message || "An error occurred", {
          autoClose: 3000,
        });
      }
      setIsSubmitting(false);
    },
    [
      completed,
      fieldName,
      targetId,
      handleAction,
      onSuccess,
      stateUpdateFunction,
    ]
  );

  return { completed, setCompleted, handleToggle, isSubmitting };
}
