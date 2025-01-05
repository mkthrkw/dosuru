import { z } from 'zod';

export const listSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'リスト名を入力してください。' })
    .max(30, { message: 'リスト名は30文字以内で入力してください。' }),
  color: z
    .string()
    .length(7),
});

export type ListSchemaType = z.infer<typeof listSchema>;