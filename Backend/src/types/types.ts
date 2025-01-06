import z from "zod";

export const createTaskInput = z.object({
  title: z.string(),
  amount: z.number(),
  options: z.array(z.string()),
  signature: z.string(),
});

export const createSubmissionInput = z.object({
  taskId: z.string(),
  selection: z.string()
})

