import addTag from "@/actions/addTag";
import getTagList from "@/actions/getTagList";
import { Tag } from "@/types/tag";
import { MicroCMSContentId } from "microcms-js-sdk";
import { useEffect, useState } from "react";

export default function useTagList() {
  const [tagList, setTagList] = useState<(Tag & MicroCMSContentId)[]>([]);
  const [isPendingLoad, setIsPendingLoad] = useState(false);
  const [isPendingAdd, setIsPendingAdd] = useState(false);

  useEffect(() => {
    (async () => {
      setIsPendingLoad(true);
      getTagList().then(tagList => {
        setTagList(tagList.contents);
      }).finally(() => {
        setIsPendingLoad(false);
      })
    })();
  }, [setTagList]);

  const addToTagList = async (newTagName: string) => {
    setIsPendingAdd(true);
    const res = await addTag(newTagName);
    const newTag = { id: res.id, name: newTagName }
    setTagList(tagList => [newTag, ...tagList]);
    setIsPendingAdd(false);
    return newTag;
  }

  return {
    tagList,
    addToTagList,
    isPendingLoad,
    isPendingAdd,
  }
}