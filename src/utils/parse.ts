import type { ValidObject } from "@/agents/crypto/types";
import { z } from "zod";

export const isObject = (input: unknown): input is ValidObject => {
  const obj = z.object({}).safeParse(input);
  return obj.success;
};

export const isArray = (input: unknown): input is Array<unknown> => {
  const arr = z.array(z.any()).safeParse(input);
  return arr.success;
};
