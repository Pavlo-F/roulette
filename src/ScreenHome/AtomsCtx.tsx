import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomWithImmer } from "jotai-immer";
import { Donate } from "../Services/DonateService/AtomsCtx";

export type TableData = {
  id: string;
  order: number;
  name: string;
  userName?: string;
  sum?: number;
};

type AnimateRow = {
  lotId: string;
  sum: number;
};

type Lot = {
  name: string;
  sum?: number;
};

type IAtoms = {
  lotAtom: PrimitiveAtom<Lot>;
  lotsAtom: PrimitiveAtom<TableData[]>;
  newLotsAtom: PrimitiveAtom<Donate[]>;
  participantsAtom: PrimitiveAtom<string[]>;
  animateRowAtom: PrimitiveAtom<AnimateRow | undefined>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    lotAtom: atomWithImmer<Lot>({ name: "" }),
    lotsAtom: atomWithStorage<TableData[]>("localSavedLots", []),
    newLotsAtom: atom<Donate[]>([]),
    participantsAtom: atom<string[]>([]),
    animateRowAtom: atom<AnimateRow | undefined>(undefined),
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

export { Context as HomeAtomsCtx, Provider as HomeAtomsProvider };
