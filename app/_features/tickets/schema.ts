import { z } from "zod";

export const ticketSchema = z.object({
  title: z
    .string()
    .min(1, { message: "タイトルを入力してください。" })
    .max(30, { message: "タイトルは30文字以内で入力してください。" }),
  description: z
    .string()
    .max(1000, { message: "説明は1000文字以内で入力してください。" })
    .nullable()
    .optional(),
  startAt: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return !isNaN(date.getTime()) ? date : null;
      }
      return null;
    },
    z.date({ message: "Invalid date format" }).nullable().optional(),
  ) as z.ZodType<string | Date | null | undefined>,
  endAt: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return !isNaN(date.getTime()) ? date : null;
      }
      return null;
    },
    z.date({ message: "Invalid date format" }).nullable().optional(),
  ) as z.ZodType<string | Date | null | undefined>,
});

export type TicketSchemaType = z.infer<typeof ticketSchema>;
