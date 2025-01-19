"use client";

import { LoadingDots } from "@/app/_components/common/LoadingDots";
import { useAiFormInputs } from "@/app/_util/hooks/useAiFormInputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { breakDownTheTaskByAi } from "../actions";
import { type AiFirstInputSchemaType, aiFirstInputSchema } from "../schema";

export function FirstInputForm() {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AiFirstInputSchemaType>({
    resolver: zodResolver(aiFirstInputSchema),
    mode: "onSubmit"
  })

  const { aiFormInputs, setAiFormInputs } = useAiFormInputs();

  const onSubmit = async (data: AiFirstInputSchemaType) => {
    const result = await breakDownTheTaskByAi({ inputValues: data });
    if (result.state === "resolved") {
      setAiFormInputs({ inputValue: result.message });
    }
    if (result.state === "rejected") {
      toast.error(result.message);
    }
  }

  return (
    <>
      {!aiFormInputs.inputValue && (
        <>
          {isSubmitting && <LoadingDots />}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="mx-4">
              <textarea
                {...register("first_input")}
                className="w-full min-h-24 bg-base-100 focus:outline-none resize-none px-2 pt-2 text-base-content text-left border-2 border-base-content/10 rounded-xl placeholder:text-base-content/50 whitespace-pre-wrap"
                placeholder="やりたいことを入力してください"
              />
              {errors.first_input && <p className="text-red-500 text-sm">{errors.first_input.message}</p>}
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-2 rounded-md self-center" disabled={isSubmitting}>タスク化する</button>
          </form>
        </>
      )}
    </>
  )
}