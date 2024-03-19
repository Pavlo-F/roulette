import { atom } from "jotai";
import { ScoreResponce } from "../../../Services/ContextuallyService/models";

export const totalSeconds = 20;

export const contextuallyAtom = atom<ScoreResponce[]>([]);
export const timeLeftAtom = atom<number>(0);
export const fetchMessageAtom = atom<string>("");
export const voteMapAtom = atom<Record<string, number>>({});
export const winValueAtom = atom<{ value: string }>({ value: "" });
export const showWinWindowAtom = atom<ScoreResponce>({} as ScoreResponce);
