import { BlogPost } from "@/types/blog";
import { TagGet } from "@/types/tag";
import { createClient, MicroCMSQueries } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export async function fetchTagList(queries?: MicroCMSQueries) {
  const listData = await client.getList<TagGet>({
    endpoint: 'tag',
    queries,
  });
  return listData;
}

export async function createBlog(content: BlogPost, isDraft: boolean) {
  await client.create<BlogPost>({
    endpoint: 'blog',
    content,
    isDraft,
  });
}