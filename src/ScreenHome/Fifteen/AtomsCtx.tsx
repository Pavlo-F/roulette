import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom, atom } from "jotai";
import { shuffleArray } from "../../Utils/common";

export const fifteenSize = 4;
export const totalSeconds = 20;

export type TableItem = {
  row: number;
  column: number;
  isFree: boolean;
  value: number;
};

export type TableData = {
  data: TableItem[];
};

type IAtoms = {
  fifteenAtom: PrimitiveAtom<TableData>;
  winValueAtom: PrimitiveAtom<number>;
  timeLeftAtom: PrimitiveAtom<number>;
  voteMapAtom: PrimitiveAtom<Record<number, number>>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const getDefault = () => {
  const result: TableItem[] = [];

  let values = [];
  for(let i = 1; i < (fifteenSize * fifteenSize); i += 1) {
    values.push(i);
  }
  values = shuffleArray(values);

  for (let i = 0; i < fifteenSize; i += 1)
    for (let j = 0; j < fifteenSize; j += 1) {
      let isFree = false;

      if (i === fifteenSize - 1 && j === fifteenSize - 1) {
        isFree = true;
      }

      result.push({ value: values.shift(), isFree, row: i, column: j });
    }

  const data: TableData = {
    data: result,
  };

  return data;
};

const create = () => {
  const r: IAtoms = {
    fifteenAtom: atom<TableData>(getDefault()),
    winValueAtom: atom<number>(0),
    timeLeftAtom: atom<number>(0),
    voteMapAtom: atom<Record<number, number>>({}),
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

export { Context as FifteenAtomsCtx, Provider as FifteenAtomsProvider };
