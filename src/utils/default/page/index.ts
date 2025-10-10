import type { BibleTalkDataType } from "@/type/page";
import { helpDoc } from "./help";
import { btDataDemo2 } from "./bt";
import { aiModelHandbook } from "./aiModel";

export const localPublicPages: BibleTalkDataType[] = [aiModelHandbook];

export const localPages: BibleTalkDataType[] = [
  helpDoc,
  btDataDemo2,
  ...localPublicPages,
];
