"use client";

import { updateUserProfileSchema, UpdateUserProfileSchemaType } from "@/app/_features/user/schema";
import { updateUserProfile } from "@/app/_features/user/actions";
import { useRouter } from "next/navigation";
import { LoadingDots } from "@/app/_components/common/LoadingDots";
import { User } from "@prisma/client";
import { useFormActionHandler } from "@/app/_util/hooks/useFormActionHandler";

export function UserUpdateForm({ user }: { user: User }) {

  const router = useRouter();
  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<UpdateUserProfileSchemaType>({
    schema: updateUserProfileSchema,
    handleAction: updateUserProfile,
    onSuccess: router.refresh,
    formReset: false,
  })

  return (
    <>
      {isSubmitting && <LoadingDots />}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col"
      >
        <label className="label">ユーザーメールアドレス</label>
        <input
          {...register('email', { value: user.email ?? "" })}
          className="input input-bordered"
        />
        {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
        <label className="label mt-4">ユーザーネーム</label>
        <input
          {...register('name', { value: user.name ?? "" })}
          className="input input-bordered mb-4"
        />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
        <button className="btn btn-primary mt-6">更新</button>
      </form>
    </>
  )
}