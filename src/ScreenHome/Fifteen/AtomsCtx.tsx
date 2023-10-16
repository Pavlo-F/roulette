import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { shuffleArray } from "../../Utils/common";

export const fifteenSize = 4;

export type TableItem = {
  row: number;
  column: number;
  isFree: boolean;
  value: number;
};

type TableData = {
  data: TableItem[];
};

type IAtoms = {
  fifteenAtom: PrimitiveAtom<TableData>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const getDefault = () => {
  const result: TableItem[] = [];

  let values = [];
  for(let i = 0; i < (fifteenSize * fifteenSize); i += 1) {
    values.push(i + 1);
  }
  values = shuffleArray(values);

  for (let i = 0; i < fifteenSize; i += 1)
    for (let j = 0; j < fifteenSize; j += 1) {
      let isFree = false;

      if (i === fifteenSize - 1 && j === fifteenSize - 1) {
        isFree = true;
      }

      result.push({ value: values.shift(), isFree, row: i, column: j});
    }

  const data: TableData = {
    data: result,
  };

  return data;
};

const create = () => {
  const r: IAtoms = {
    fifteenAtom: atom<TableData>(getDefault()),
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
