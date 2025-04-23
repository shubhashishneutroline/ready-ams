import { z } from "zod"

// Zod schema for FAQ validation
export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().optional(),
  isActive: z.boolean(),
  order: z.number().optional(),
  lastUpdatedById: z.string(),
  createdById: z.string(),
})
