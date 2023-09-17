import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomWithImmer } from "jotai-immer";

export type TableData = {
  id: string;
  order: number;
  name: string;
  sum?: number;
};

type Lot = {
  name: string;
  sum?: number;
};

type IAtoms = {
  lotAtom: PrimitiveAtom<Lot>;
  lotsAtom: PrimitiveAtom<TableData[]>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    lotAtom: atomWithImmer<Lot>({ name: "" }),
    lotsAtom: atomWithStorage<TableData[]>("localSavedLots", []),
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
