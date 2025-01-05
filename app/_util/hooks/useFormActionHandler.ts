"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { ActionState } from "@/app/_util/types/actionType";
import { useCallback } from "react";

export function useFormActionHandler<TFormValues extends Record<string, unknown>>({
  schema,
  handleAction,
  targetId,
  onSuccess = () => {},
  formReset = false,
  successToast = true,
  mode = "onBlur",
}: {
  schema: z.ZodSchema<TFormValues>; // Zodスキーマ
  handleAction:
    | ((inputValues: TFormValues, targetId: string) => Promise<ActionState>)
    | ((inputValues: TFormValues) => Promise<ActionState>);
  targetId?: string; // IDが必要な場合
  onSuccess?: () => void; // 成功時の処理
  formReset?: boolean;
  successToast?: boolean;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // フォームをリセットするため
    setValue,
  } = useForm<TFormValues>({
    mode: mode,
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<TFormValues> = useCallback(
    async (inputValues) => {
      // 結果処理の共通関数
      const handleResult = (result: ActionState) => {
        if (result.state === "resolved") {
          if (successToast) {
            toast.success(result.message || "Success");
          }
          if (onSuccess) onSuccess();
          if (formReset) reset();
        } else if (result.state === "rejected") {
          toast.error(result.message || "An error occurred", {
            autoClose: 3000,
          });
        }
      };

      if (targetId) {
        const result = await (
          handleAction as (inputValues: TFormValues, targetId: string) => Promise<ActionState>
        )(inputValues, targetId);
        handleResult(result);
      } else {
        const result = await (handleAction as (inputValues: TFormValues) => Promise<ActionState>)(
          inputValues,
        );
        handleResult(result);
      }
    },
    [handleAction, targetId, onSuccess, formReset, reset, successToast],
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    setValue,
  };
}
