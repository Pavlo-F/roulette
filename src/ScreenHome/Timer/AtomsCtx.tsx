import React, {
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PrimitiveAtom, atom, useAtom, useAtomValue, useSetAtom } from "jotai";

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
  addTime: (milliseconds: number) => void;
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
  ({ children, totalMilliseconds }: Props) => {
    const [atoms] = useState(() => create(totalMilliseconds));

    const [isStarted, setIsStarted] = useAtom(atoms.isStartedAtom);
    const [elepsated, setElepsated] = useAtom(atoms.elepsatedAtom);
    const setTotalMillisecond = useSetAtom(atoms.totalMillisecondsAtom);

    const reset = useCallback(() => {
      setElepsated(0);
    }, [setElepsated]);

    const addTime = useCallback(
      (milliseconds: number) => {
        setElepsated(draft => -milliseconds + draft);
      },
      [setElepsated]
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

        mainInterval = window.setInterval(() => {
          const result = elepsated + intervalStep;

          if (result >= totalMilliseconds) {
            clearInterval(mainInterval);
            setElepsated(totalMilliseconds);
            setIsStarted(false);
          } else {
            setElepsated(result);
          }
        }, intervalStep);
      } else {
        clearInterval(mainInterval);
      }
    }, [elepsated, isStarted, setElepsated, setIsStarted, totalMilliseconds]);

    return <Context.Provider value={ctx}>{children}</Context.Provider>;
  }
);

export { Context as TimerAtomsCtx, Provider as TimerAtomsProvider };
