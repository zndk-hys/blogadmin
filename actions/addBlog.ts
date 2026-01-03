'use server'

import { z } from "zod";
import { createBlog } from "@/lib/microcms";
import { BlogPost } from "@/types/blog";
import { blogFormSchema } from "@/lib/validations/blog";

export type AddBlogResponse = {
  error: true;
  message?: string;
  errors?: Record<string, string[]>;
} | {
  error: false;
  id: string;
};

export default async function addBlog(formData: FormData): Promise<AddBlogResponse> {
  const raw = {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    tags: formData.getAll('tags').map(tag => String(tag)),
    publishedAt: String(formData.get('publishedAt') ?? '').trim(),
    isDraft: String(formData.get('isDraft') ?? '') === 'on' ? true : false,
  }

  const validatedFields = blogFormSchema.safeParse(raw);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      error: true,
      message: 'バリデーションエラーが発生しました',
      errors: flattenedErrors.fieldErrors,
    };
  }

  const { isDraft, publishedAt, ...rest } = validatedFields.data;

  // 公開かつ公開日が指定されている場合は追加
  let content: BlogPost = rest;
  if ( !isDraft && publishedAt ) {
    content = {
      ...content,
      publishedAt,
    }
  };

  try {
    const response = await createBlog(content, isDraft);
    return {
      error: false,
      id: response.id,
    };
  } catch(e) {
    console.error('Failed to create blog:', e);
    return {
      error: true,
      message: e instanceof Error ? e.message : 'ブログの作成に失敗しました',
    };
  }
}

