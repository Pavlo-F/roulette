import React, {
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PrimitiveAtom, atom, useAtomValue, useSetAtom } from "jotai";

let mainInterval = 0;
const intervalStep = 1000;

type IParams = {
  totalMilliseconds: number;
  addMilliseconds: number;
};

type IAtoms = {
  totalMillisecondsAtom: PrimitiveAtom<number>;
  elepsatedAtom: PrimitiveAtom<number>;
  isStartedAtom: PrimitiveAtom<boolean>;
  reset: () => void;
  addTime: (order: number) => void;
};

type IContext = IAtoms;

type Props = IParams & {
  children: React.ReactNode;
};

const create = (
  totalMilliseconds: number,
  resetFn: () => void = () => {},
  addTimeFn: (order: number) => void = () => {}
) => {
  const r: IAtoms = {
    totalMillisecondsAtom: atom<number>(totalMilliseconds),
    elepsatedAtom: atom<number>(0),
    isStartedAtom: atom<boolean>(false),
    reset: resetFn,
    addTime: addTimeFn,
  };

  return r;
};

const Context = createContext<IContext>(create(0));

const Provider = memo(
  ({ children, totalMilliseconds, addMilliseconds }: Props) => {
    const [atoms] = useState(() => create(totalMilliseconds));

    const isStarted = useAtomValue(atoms.isStartedAtom);
    const setElepsated = useSetAtom(atoms.elepsatedAtom);
    const setTotalMillisecond = useSetAtom(atoms.totalMillisecondsAtom);

    const reset = useCallback(() => {
      setElepsated(0);
    }, [setElepsated]);

    const addTime = useCallback(
      (order: number) => {
        setElepsated(draft => -order * addMilliseconds + draft);
      },
      [addMilliseconds, setElepsated]
    );

    useEffect(() => {
      setTotalMillisecond(totalMilliseconds);
    }, [setTotalMillisecond, totalMilliseconds]);

    const ctx = useMemo(() => {
      const r: IContext = {
        ...atoms,
        reset,
        addTime,
      };
      return r;
    }, [addTime, atoms, reset]);

    useEffect(() => {
      if (isStarted) {
        clearInterval(mainInterval);

        mainInterval = setInterval(() => {
          setElepsated(old => old + intervalStep);
        }, intervalStep);
      } else {
        clearInterval(mainInterval);
      }
    }, [isStarted, setElepsated]);

    return <Context.Provider value={ctx}>{children}</Context.Provider>;
  }
);

export { Context as TimerAtomsCtx, Provider as TimerAtomsProvider };
