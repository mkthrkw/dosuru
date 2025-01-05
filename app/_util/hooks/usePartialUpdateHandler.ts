import { findFirstDifferenceKey, pickObject } from "@/app/_util/helper/object";
import { toast } from "react-toastify";
import { ActionState } from "@/app/_util/types/actionType";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function usePartialUpdateHandler<
  TFormValues extends Record<string, unknown>,
  TOldValues extends Record<string, unknown>,
>({
  schema,
  handleAction,
  targetId,
  oldValues,
  onSuccess = () => {},
  stateUpdateFunction,
}: {
  schema: z.ZodSchema<TFormValues>; // Zodスキーマ
  handleAction: (inputValues: Partial<TFormValues>, targetId: string) => Promise<ActionState>;
  targetId: string; // IDが必要な場合
  oldValues: TOldValues | null;
  onSuccess?: () => void; // 成功時の処理
  stateUpdateFunction?: (inputValues: Partial<TFormValues>) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TFormValues>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const onBlur: SubmitHandler<TFormValues> = useCallback(
    async (inputValues) => {
      if (!oldValues) return;

      const diffKey = findFirstDifferenceKey<TFormValues, TOldValues>(inputValues, oldValues);
      if (!diffKey) return;
      const targetParam = pickObject(inputValues, [diffKey]);

      const result = await handleAction(targetParam, targetId);
      if (result.state === "resolved") {
        if (onSuccess) onSuccess();
        if (stateUpdateFunction) stateUpdateFunction(targetParam);
      }
      if (result.state === "rejected") {
        toast.error(result.message || "An error occurred", {
          autoClose: 3000,
        });
      }
    },
    [handleAction, targetId, onSuccess, oldValues, stateUpdateFunction],
  );

  return {
    register,
    handleSubmit: handleSubmit(onBlur),
    errors,
    isSubmitting,
    setValue,
  };
}
