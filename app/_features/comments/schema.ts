import { z } from "zod";

export const commentSchema = z.object({
  text: z
    .string()
    .min(1, { message: "コメントを入力してください" })
    .max(1000, { message: "1000文字以内で入力してください。" }),
});

export type CommentSchemaType = z.infer<typeof commentSchema>;
