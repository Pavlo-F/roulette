import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export type Token = {
  token: string;
};

export type Challenge = {
  id: string;
  name: string;
};

const storage = createJSONStorage<Token>(() => localStorage);

export const tokenAtom = atomWithStorage<Token>("Contextually_Token", { token: "" }, storage, {
  getOnInit: true,
});
export const challengeAtom = atom<Challenge>({} as Challenge);
