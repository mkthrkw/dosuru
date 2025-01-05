'use client';

import { AuthSchemaType, authSchema } from "@/app/_features/auth/schema";
import { login } from "@/app/_features/auth/actions";
import { LoadingDots } from "@/app/_components/common/LoadingDots";
import { redirect } from "next/navigation";
import { useFormActionHandler } from "@/app/_util/hooks/useFormActionHandler";

export function LoginForm() {

  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<AuthSchemaType>({
    schema: authSchema,
    handleAction: login,
    onSuccess: () => redirect("/dosuru"),
  });

  return (
    <>
      {isSubmitting && <LoadingDots />}
      <form
        onSubmit={handleSubmit}
        className="card-body"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            {...register("email")}
            placeholder="email"
            className="input input-bordered w-full text-base-content"
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="password"
            className="input input-bordered w-full text-base-content"
          />
          {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-secondary">Login</button>
        </div>
      </form>
    </>
  );
}