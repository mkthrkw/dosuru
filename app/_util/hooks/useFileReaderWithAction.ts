"use client";
import { toast } from "react-toastify";
import { useCallback, useRef, useState } from "react";
import { ActionState } from "../types/actionType";

export const useFileReaderWithAction = ({
  handleAction,
  targetId,
  onSuccess,
}: {
  handleAction:
    | ((fileData: string, targetId: string) => Promise<ActionState>)
    | ((fileData: string) => Promise<ActionState>);
  targetId?: string;
  onSuccess?: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(() => {
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

    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setIsSubmitting(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (typeof reader.result === "string") {
          // 型ガードを使用して動的にhandleActionを呼び出す
          if (targetId) {
            const result = await (
              handleAction as (
                fileData: string,
                targetId: string
              ) => Promise<ActionState>
            )(reader.result, targetId);
            handleResult(result);
          } else {
            const result = await (
              handleAction as (fileData: string) => Promise<ActionState>
            )(reader.result);
            handleResult(result);
          }
        } else {
          toast.error("Failed to read the file.");
        }
      } catch (error) {
        toast.error(`An error occurred while processing the file: ${error}`);
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.");
      setIsSubmitting(false);
    };
    reader.readAsDataURL(file);
  }, [handleAction, targetId, onSuccess]);

  return { inputRef, handleChange, isSubmitting };
};
