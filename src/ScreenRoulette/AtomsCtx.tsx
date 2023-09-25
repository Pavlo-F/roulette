import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom, atom } from "jotai";
import { WheelData } from "./Roulette/models";

export enum Mode {
  Classic,
  Elimination,
};

export const slowPhrases = [
  "Cлишком слабо",
  "Крути сильнее!",
  "В детстве каши мало ел?",
  "Похоже и правда мало... иди поешь и возвращайся",
  "А ты точно умеешь крутить?",
  "Да ты издеваешься...",
  "Ты не достоин чтобы меня вертеть!",
  "Чатик, помогите ему уже крутануть наконец-то",
  "Ай ладно, сам крутанусь, слабак. Хотя нет, страдай",
];

type IAtoms = {
  modeAtom: PrimitiveAtom<Mode>;
  winMessageAtom: PrimitiveAtom<WheelData | undefined>;
  removeMessageAtom: PrimitiveAtom<WheelData | undefined>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    modeAtom: atom<Mode>(Mode.Classic),
    winMessageAtom: atom<WheelData | undefined>(undefined),
    removeMessageAtom: atom<WheelData | undefined>(undefined),
  };

  return r;
};

const Context = createContext<IContext>(create());

const Provider = memo(({ children }: Props) => {
  const [atoms] = useState(() => create());

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as RouletteAtomsCtx, Provider as RouletteAtomsProvider };
