"use client";
import { toast } from "react-toastify";
import { ActionState } from "@/app/_util/types/actionType";
import { useCallback, useState } from "react";

export function useClickActionHandler({
  handleAction,
  targetId,
  onSuccess,
}: {
  handleAction: (targetId: string) => Promise<ActionState>;
  targetId: string; // 対象のID
  onSuccess?: () => void; // 成功時の処理
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = useCallback(async () => {
    // 結果処理の共通関数
    const handleResult = (result: ActionState) => {
      if (result.state === "resolved") {
        toast.success(result.message || "Success");
        if (onSuccess) onSuccess();
      } else if (result.state === "rejected") {
        toast.error(result.message || "An error occurred", {
          autoClose: 3000,
        });
      }
    };

    setIsSubmitting(true);
    const result = await handleAction(targetId);
    handleResult(result);
    setIsSubmitting(false);
  }, [handleAction, targetId, onSuccess]);

  return {
    handleClick,
    isSubmitting,
  };
}
