import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" }),
  password: z.string().min(8, { message: "8文字以上で入力してください" }),
});

export type AuthSchemaType = z.infer<typeof authSchema>;
