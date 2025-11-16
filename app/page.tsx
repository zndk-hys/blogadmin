import addBlog from "@/actions/addBlog";
import { fetchTagList } from "@/lib/microcms";

export const revalidate = 0;

export default async function Home() {
  const tagList = await fetchTagList({
    limit: 100,
  });

  return (
    <div>
      <form action={addBlog}>
        <div>
          タイトル：<br />
          <input name="title" type="text" />
        </div>
        <div>
          本文：<br />
          <textarea name="body"></textarea>
        </div>
        <div>
          タグ：<br />
          {tagList.contents.map(tag => (
            <div key={tag.id}>
              <input type="checkbox" name="tags" value={tag.id} />{tag.name}
            </div>
          ))}
        </div>
        <div>
          公開日：<br />
          <input type="datetime-local" name="publishedAt" />
        </div>
        <div>
          下書き：<input type="checkbox" name="isDraft" />
        </div>
        <button type="submit">投稿</button>
      </form>
    </div>
  );
}
