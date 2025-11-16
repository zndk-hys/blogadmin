'use server'

import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export default async function addArticle() {
  client.create({
    endpoint: 'blog',
    content: {
      title: 'テストタイトル',
      body: '<p>Hello</p>',
    }
  });
}