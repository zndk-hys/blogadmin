import { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";

export type Tag = {
    name: string;
};

export type TagGet = Tag & MicroCMSContentId & MicroCMSDate;
export type TagPost = Tag & Partial<MicroCMSDate>;