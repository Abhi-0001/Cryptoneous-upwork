import z from "zod";

export const createTaskInput = z.object({
  title: z.string(),
  amount: z.string(),

  options: z.array(z.string()),
  signature: z.string(),
});
