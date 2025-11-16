'use server'

import { createBlog } from "@/lib/microcms";
import { BlogPost } from "@/types/blog";

export default async function addBlog(formData: FormData) {
  const raw = {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    tags: formData.getAll('tags').map(tag => String(tag)) ?? [],
    publishedAt: String(formData.get('publishedAt') ?? '').trim(),
    isDraft: String(formData.get('isDraft') ?? '') === 'on' ? true : false,
  }

  const { isDraft, publishedAt, ...rest } = raw;

  // 公開かつ公開日が指定されている場合は追加
  let content: BlogPost = rest;
  if ( !isDraft && publishedAt ) {
    content = {
      ...content,
      publishedAt,
    }
  };

  await createBlog(content, isDraft);
}

