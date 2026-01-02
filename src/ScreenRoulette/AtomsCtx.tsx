import React, { createContext, memo, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, atom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { WheelData } from "./Roulette/models";

export enum Mode {
  Classic,
  Elimination,
}

export const slowPhrases = [
  "Cлишком слабо",
  "Крути сильнее!",
  "В детстве каши мало ел?",
  "А ты точно умеешь крутить?",
  "Да ты издеваешься...",
  "Ты не достоин чтобы меня вертеть!",
  "Чатик, помогите ему уже крутануть наконец-то",
];

type IParams = {
  wheelData: WheelData[];
};

type IAtoms = {
  modeAtom: PrimitiveAtom<Mode>;
  winMessageAtom: PrimitiveAtom<WheelData | undefined>;
  removeMessageAtom: PrimitiveAtom<WheelData | undefined>;
  wheelDataAtom: PrimitiveAtom<WheelData[]>;
  speedStopAtom: PrimitiveAtom<number>;
  spinWheelAtom: PrimitiveAtom<number>;
  speedAtom: PrimitiveAtom<number>;
};

type IContext = IAtoms;

type Props = IParams & {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    modeAtom: atomWithStorage<Mode>("rouletteMode", Mode.Elimination),
    winMessageAtom: atom<WheelData | undefined>(undefined),
    removeMessageAtom: atom<WheelData | undefined>(undefined),
    wheelDataAtom: atom<WheelData[]>([]),
    speedStopAtom: atomWithStorage<number>("rouletteSpeed", 50),
    speedAtom: atomWithStorage<number>("rouletteSpinSpeed", 50),
    spinWheelAtom: atom<number>(0),
  };

  return r;
};

const Context = createContext<IContext>(create());

const Provider = memo(({ children, wheelData }: Props) => {
  const [atoms] = useState(() => create());
  const setWheelData = useSetAtom(atoms.wheelDataAtom);

  useEffect(() => {
    setWheelData(wheelData);
  }, [setWheelData, wheelData]);

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as RouletteAtomsCtx, Provider as RouletteAtomsProvider };
