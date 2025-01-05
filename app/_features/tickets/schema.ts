import { z } from "zod";

export const ticketCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "タイトルを入力してください。" })
    .max(30, { message: "タイトルは30文字以内で入力してください。" }),
  description: z
    .string()
    .max(1000, { message: "説明は1000文字以内で入力してください。" })
    .nullish(),
});

export const ticketUpdateSchema = ticketCreateSchema.extend({
  startAt: z
    .string()
    .refine((value) => !value || !isNaN(new Date(value).getTime()), {
      message: "無効な日付形式です",
    })
    .transform((value) => (value ? new Date(value) : null)) // 入力があればDate型に変換
    .nullish(), // 未入力を許容
  endAt: z
    .string()
    .refine((value) => !value || !isNaN(new Date(value).getTime()), {
      message: "無効な日付形式です",
    })
    .transform((value) => (value ? new Date(value) : null)) // 入力があればDate型に変換
    .nullish(),
});

export type TicketCreateSchemaType = z.input<typeof ticketCreateSchema>;
export type InputTicketUpdateSchemaType = z.input<typeof ticketUpdateSchema>;
export type OutputTicketUpdateSchemaType = z.output<typeof ticketUpdateSchema>;
