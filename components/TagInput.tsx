'use client'

import useTagList from "@/hooks/useTagList";
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

  // タグのフィルタリング
  const keyword = newTagName.toLocaleLowerCase().trim();
  const filteredTagList =
    keyword === ''
      ? tagList.map(tag => tag.id)
      : tagList.filter(tag => tag.name.toLowerCase().includes(keyword)).map(tag => tag.id);

  return (
    <>
      <div>
        タグの追加：<br />
        <input
          type="text"
          value={newTagName}
          onChange={e => setNewTagName(e.target.value)}
          onKeyDown={e => {if (e.key === 'Enter') { e.preventDefault()}}}
        />
        <button onClick={handleAddTag} disabled={isPendingAdd}>追加</button>
        {isPendingAdd && '追加中'}
      </div>
      <div>
        タグ：<br />
        <div style={{height: '200px', overflow: 'scroll'}}>
          {isPendingLoad ? <p>読み込み中</p> : tagList.map(tag => (
            <div key={tag.id} style={{display: filteredTagList.includes(tag.id) ? 'block' : 'none'}}>
              <label>
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.id}
                  onChange={e => handleChangeSelect(tag.id, e.target.checked)}
                  checked={selectedTagIds.includes(tag.id)}
                />{tag.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}