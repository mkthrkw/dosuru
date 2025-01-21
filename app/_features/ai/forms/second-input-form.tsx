"use client";

import { LoadingDots } from "@/app/_components/common/LoadingDots";
import { useLlmFormStore } from "@/app/_features/ai/store/useLlmFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createProjectByAi } from "../actions";
import { type AiSecondInputSchemaType, aiSecondInputSchema } from "../schema";

export function SecondInputForm() {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AiSecondInputSchemaType>({
    resolver: zodResolver(aiSecondInputSchema),
    mode: "onSubmit"
  })

  const { inputValue, setValue } = useLlmFormStore();
  const router = useRouter();

  const onSubmit = async (data: AiSecondInputSchemaType) => {
    const result = await createProjectByAi({ inputValues: data });
    if (result.state === "resolved") {
      setValue("");
      router.push(`/dosuru/${result.createdId}`);
    }
    if (result.state === "rejected") {
      toast.error(result.message);
    }
  }

  return (
    <>
      {inputValue && (
        <>
          {isSubmitting && <LoadingDots />}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="mx-4">
              <textarea
                {...register("second_input")}
                className="textarea w-full focus:outline-none px-2 pt-2 text-base-content text-left border-2 border-base-content/10 rounded-xl placeholder:text-base-content/50 whitespace-pre-wrap"
                defaultValue={inputValue}
              />
              {errors.second_input && <p className="text-red-500 text-sm">{errors.second_input.message}</p>}
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-2 rounded-md self-center" disabled={isSubmitting}>プロジェクトを作成する</button>
          </form>
        </>
      )}
    </>
  )
}