import addTag from "@/actions/addTag";
import getTagList from "@/actions/getTagList";
import { Tag } from "@/types/tag";
import { MicroCMSContentId } from "microcms-js-sdk";
import { useEffect, useState, useTransition } from "react";

export default function useTagList() {
  const [tagList, setTagList] = useState<(Tag & MicroCMSContentId & {new?: boolean})[]>([]);
  const [isPendingLoad, startTransitionLoad] = useTransition();
  const [isPendingAdd, setIsPendingAdd] = useState(false);

  useEffect(() => {
    startTransitionLoad(async () => {
      const tagList = await getTagList();
      setTagList(tagList.contents);
    });
  }, [setTagList]);

  const addToTagList = async (newTagName: string) => {
    setIsPendingAdd(true);
    const res = await addTag(newTagName);
    if (res.id) {
      const newTag = { id: res.id, name: newTagName, new: true }
      setTagList(tagList => [newTag, ...tagList]);
    }
    setIsPendingAdd(false);
  }

  return {
    tagList,
    addToTagList,
    isPendingLoad,
    isPendingAdd,
  }
}