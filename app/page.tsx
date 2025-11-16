import addBlog from "@/actions/addBlog";
import TagInput from "@/components/TagInput";

export const revalidate = 0;

export default async function Home() {
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
        <TagInput />
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
