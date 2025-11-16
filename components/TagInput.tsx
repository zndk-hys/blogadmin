'use client'

import useTagList from "@/hooks/useTagList";
import { Trash2 } from "lucide-react";
import { MouseEventHandler, useState } from "react";

export default function TagInput() {
  const [newTagName, setNewTagName] = useState('');
  const {isPendingLoad, isPendingAdd, tagList, addToTagList} = useTagList();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // タグ追加ボタン
  const handleAddTag: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if(newTagName) {
      const newTag = await addToTagList(newTagName);
      setSelectedTagIds(ids => [...ids, newTag.id]);
      setNewTagName('');
    }
  }

  // タグ選択変更
  const handleChangeSelect = (id: string, isChecked: boolean) => {
    setSelectedTagIds(prevIds => {
      return isChecked ? [...prevIds, id] : prevIds.filter(deleteId => deleteId !== id);
    })
  }

  // タグの選択解除
  const handleUnselectTag = (id: string) => {
    setSelectedTagIds(prevIds => prevIds.filter(deleteId => deleteId !== id));
  }

  // タグのフィルタリング
  const keyword = newTagName.toLocaleLowerCase().trim();
  const filteredTagList =
    keyword === ''
      ? tagList.map(tag => tag.id)
      : tagList.filter(tag => tag.name.toLowerCase().includes(keyword)).map(tag => tag.id);

  return (
    <>
      <div className="text-sm">
        <h2 className="text-1xl font-bold mb-1">タグ</h2>
        <div className="flex gap-2 mb-2">
          <div className="flex-auto">
            <input
              type="text"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              onKeyDown={e => {if (e.key === 'Enter') { e.preventDefault()}}}
              className="bg-gray-100 px-3 py-2 rounded-sm w-full"
              placeholder="検索"
            />
          </div>
          <div className="basis-20">
            <button
              onClick={handleAddTag}
              disabled={isPendingAdd}
              className="bg-blue-400 text-white py-2 rounded-sm w-full cursor-pointer hover:bg-blue-500 transition"
            >{isPendingAdd ? '追加中' : '追加'}</button>
          </div>
        </div>
      </div>
      <div className="border-1 border-gray-300 rounded-sm px-2 mb-3">
        <div style={{overflow: 'scroll'}} className="py-1 h-100">
          {isPendingLoad ? <p className="text-sm py-1 text-gray-400">読み込み中...</p> : tagList.map(tag => (
            <div key={tag.id} style={{display: filteredTagList.includes(tag.id) ? 'block' : 'none'}}>
              <label className="flex gap-1 py-1 cursor-pointer">
                <div className="inline-flex items-center">
                  <div className="flex items-center relative">
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag.id}
                      onChange={e => handleChangeSelect(tag.id, e.target.checked)}
                      checked={selectedTagIds.includes(tag.id)}
                      className="peer h-4 w-4 transition-all appearance-none rounded-sm border border-gray-400 checked:bg-gray-800 checked:border-gray-800"
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  {tag.name}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-bold text-gray-400">選択済み：</div>
        {tagList.filter(tag => selectedTagIds.includes(tag.id)).map(tag => (
          <div key={tag.id} className="text-sm">
            <div className="flex items-center border-b-1 py-1 border-gray-200">
              <div className="basis-full">{tag.name}</div>
              <div className="leading-0">
                <button
                  onClick={e => {
                    e.preventDefault();
                    handleUnselectTag(tag.id);
                  }}
                  className="align-bottom w-8 h-8 flex justify-center items-center cursor-pointer rounded-full hover:bg-red-100"
                ><Trash2 size={16} color="#ff6467" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}