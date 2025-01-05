import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'プロジェクト名を入力してください。' })
    .max(30, { message: 'プロジェクト名は30文字以内で入力してください。' }),
  description: z
    .string()
    .max(200, { message: 'プロジェクトの説明は200文字以内で入力してください。' })
    .nullable(),
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;