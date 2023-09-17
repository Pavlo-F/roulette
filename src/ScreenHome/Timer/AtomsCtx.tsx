import React, { createContext, memo, useCallback, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, atom, useAtomValue, useSetAtom } from "jotai";

let mainInterval = 0;
const intervalStep = 1000;

type IAtoms = {
  totalMillisecondsAtom: PrimitiveAtom<number>;
  elepsatedAtom: PrimitiveAtom<number>;
  isStartedAtom: PrimitiveAtom<boolean>;
  reset: () => void;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = (resetFn: () => void = () => {}) => {
  const r: IAtoms = {
    totalMillisecondsAtom: atom<number>(60 * 60 * 1000),
    elepsatedAtom: atom<number>(0),
    isStartedAtom: atom<boolean>(false),
    reset: resetFn,
  };

  return r;
};

const Context = createContext<IContext>(create());

const Provider = memo(({ children }: Props) => {


  const [atoms] = useState(() => create());

  const isStarted = useAtomValue(atoms.isStartedAtom);
  const setElepsated = useSetAtom(atoms.elepsatedAtom);

  const reset = useCallback(() => {
    setElepsated(0);
  }, [setElepsated]);

  atoms.reset = reset;

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);



  useEffect(() => {
    if (isStarted) {
      clearInterval(mainInterval);

      mainInterval = setInterval(() => {
        setElepsated((old) => old + intervalStep);
      }, intervalStep);
    } else {
      clearInterval(mainInterval);
    }
  }, [isStarted, setElepsated]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as TimerAtomsCtx, Provider as TimerAtomsProvider };
