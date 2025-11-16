'use server'

import { createTag } from "@/lib/microcms";

export default async function addTag(name: string) {
  const content = {
    name,
  };

  const id = await createTag(content, false);

  return id;
}