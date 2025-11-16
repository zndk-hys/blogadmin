import { MicroCMSContentId, MicroCMSDate, MicroCMSImage } from "microcms-js-sdk";
import { TagGet } from "./tag";

export type Blog<T> = {
    title: string;
    body: string;
    eyecatch?: MicroCMSImage;
    tags: T[];
}

export type BlogGet = Blog<TagGet> & MicroCMSContentId & MicroCMSDate;
export type BlogPost = Blog<string> & Partial<MicroCMSDate>;