'use server'

import { createBlog } from "@/lib/microcms";

export default async function addBlog(formData: FormData) {
  const raw = {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    tags: formData.getAll('tags').map(tag => String(tag)) ?? [],
    publishedAt: String(formData.get('publishedAt') ?? ''),
    isDraft: String(formData.get('isDraft') ?? '') === 'on' ? true : false,
  }

  // 下書きの場合はpublishedAtを無視
  const { isDraft, publishedAt, ...rest } = raw;
  const content = isDraft ? rest : { ...rest, publishedAt };

  await createBlog(content, isDraft);
}