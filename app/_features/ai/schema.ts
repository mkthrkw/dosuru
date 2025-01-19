import { z } from "zod";

export const aiFirstInputSchema = z.object({
	first_input: z.string().min(4, { message: "4文字以上で入力してください" }),
});

export type AiFirstInputSchemaType = z.infer<typeof aiFirstInputSchema>;

export const aiSecondInputSchema = z.object({
	second_input: z.string().min(10, { message: "10文字以上で入力してください" }),
});

export type AiSecondInputSchemaType = z.infer<typeof aiSecondInputSchema>;
