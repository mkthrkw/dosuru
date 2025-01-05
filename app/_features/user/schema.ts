import { z } from "zod";

/*
 * Create
 */

export const createUserSchema = z.object({
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" })
    .min(1, { message: "メールアドレスは空欄に出来ません" })
    .max(100, { message: "メールアドレスが長すぎます" }),
  name: z
    .string()
    .max(30, { message: "名前は30文字以内にしてください" })
    .nullable(),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上にしてください" }),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

/*
 * Update profile
 */

export const updateUserProfileSchema = createUserSchema.omit({
  password: true,
});

export type UpdateUserProfileSchemaType = z.infer<
  typeof updateUserProfileSchema
>;
