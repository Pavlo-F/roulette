import { atom } from "jotai";

export type Token = {
  token: string;
};

export type Challenge = {
  id: string;
  name: string;
};

export const tokenAtom = atom<Token>({ token: "" });
export const challengeAtom = atom<Challenge>({} as Challenge);
