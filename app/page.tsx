import addBlog from "@/actions/addBlog";
import TagInput from "@/components/TagInput";

export const revalidate = 0;

export default async function Home() {
  return (
    <form action={addBlog}>
      <div className="grid grid-cols-12 gap-x-5">
        <div className="col-span-9">
          <h1 className="text-3xl font-bold mb-8">記事の投稿</h1>
          <div className="mb-4">
            <input name="title" type="text" placeholder="タイトル" className="bg-gray-100 w-full px-3 py-3 rounded-sm" />
          </div>
          <div>
            <textarea name="body" placeholder="本文" className="bg-gray-100 w-full h-100 px-3 py-3 rounded-sm"></textarea>
          </div>
          <div className="text-sm mb-4">
            <div className="grid grid-cols-6 items-center h-15 border-b-1 border-gray-200">
              <div>公開日</div>
              <div className="col-span-5">
                <input type="datetime-local" name="publishedAt" className="bg-gray-100 px-3 py-2 rounded-sm" />
              </div>
            </div>
            <div className="grid grid-cols-6 items-center h-15 border-b-1 border-gray-200">
              <div>下書き</div>
              <div className="col-span-5 leading-0">
                <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input type="checkbox" name="isDraft" className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm border border-gray-400 checked:bg-gray-800 checked:border-gray-800" />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-400 text-white px-10 py-2 rounded-sm cursor-pointer hover:bg-blue-500 transition">投稿</button>
          </div>
        </div>
        <div className="col-span-3">
          <TagInput />
        </div>
      </div>
    </form>
  );
}
