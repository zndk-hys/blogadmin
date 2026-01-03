import { z } from 'zod'

export const blogFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  body: z.string().default(''),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().optional(),
  isDraft: z.boolean().default(false),
})

export type BlogFormData = z.infer<typeof blogFormSchema>
