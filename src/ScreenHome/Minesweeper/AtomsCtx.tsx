import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom, atom } from "jotai";

export const minesweeperSize = {
  rows: 10,
  columns: 10,
};

export const totalMines = Math.floor(minesweeperSize.columns * minesweeperSize.rows * 0.2);

export const totalSeconds = 20;

export type TableItem = {
  row: number;
  column: number;
  isMine: boolean;
  value: number;
  status: "opened" | "closed"
};

type IAtoms = {
  minesweeperAtom: PrimitiveAtom<TableItem[][]>;
  timeLeftAtom: PrimitiveAtom<number>;
  voteMapAtom: PrimitiveAtom<Record<number, number>>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

export const getDefault = () => {
  const total = minesweeperSize.columns * minesweeperSize.rows;
  const mines = new Set<number>();
  while (mines.size !== totalMines) {
    mines.add(Math.floor(Math.random() * total) + 1);
  }

  const minesArray: number[] = [...mines];

  const result: TableItem[][] = [[]];

  for (let i = 0; i < minesweeperSize.rows; i += 1) {
    result[i] = [];

    for (let j = 0; j < minesweeperSize.columns; j += 1) {
      const value = i * minesweeperSize.rows + j + 1;
      result[i][j] = { value, isMine: minesArray.includes(value), row: i, column: j, status: "closed" };
    }
  }

  return result;
};

const create = () => {
  const r: IAtoms = {
    minesweeperAtom: atom<TableItem[][]>(getDefault()),
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

export { Context as MinesweeperAtomsCtx, Provider as MinesweeperAtomsProvider };
