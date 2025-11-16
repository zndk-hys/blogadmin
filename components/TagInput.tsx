'use client'

import useTagList from "@/hooks/useTagList";
import { MouseEventHandler, useState } from "react";

export default function TagInput() {
  const [newTagName, setNewTagName] = useState('');
  const {isPendingLoad, isPendingAdd, tagList, addToTagList} = useTagList();

  const handleAddTag: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if(newTagName) {
      await addToTagList(newTagName);
      setNewTagName('');
    }
  }

  return (
    <>
      <div>
        タグの追加：<br />
        <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} />
        <button onClick={handleAddTag} disabled={isPendingAdd}>追加</button>
        {isPendingAdd && '追加中'}
      </div>
      <div>
        タグ：<br />
        <div style={{height: '200px', overflow: 'scroll'}}>
          {isPendingLoad ? <p>読み込み中</p> : tagList.map(tag => (
            <div key={tag.id}>
              <input type="checkbox" name="tags" value={tag.id} defaultChecked={tag.new} />{tag.name}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}