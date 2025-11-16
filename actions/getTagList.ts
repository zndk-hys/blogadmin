'use server'

import { fetchTagList } from "@/lib/microcms";

export default async function getTagList() {
  const tagList = await fetchTagList({
    limit: 100,
  });

  return tagList;
}