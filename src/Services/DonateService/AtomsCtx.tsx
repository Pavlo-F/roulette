import React, { createContext, memo, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, atom, useSetAtom } from "jotai";
import { DonateServiceStatus } from "./models";

export type Donate = {
  id: string;
  name: string;
  comment: string;
  sum: number;
  currency: string;
};

type IAtoms = {
  donateAtom: PrimitiveAtom<Donate>;
  donatePayStatusAtom: PrimitiveAtom<DonateServiceStatus>;
  donationAlertsStatusAtom: PrimitiveAtom<DonateServiceStatus>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    donateAtom: atom<Donate>({} as Donate),
    donatePayStatusAtom: atom<DonateServiceStatus>(DonateServiceStatus.Disconnected),
    donationAlertsStatusAtom: atom<DonateServiceStatus>(DonateServiceStatus.Disconnected),
  };

  return r;
};

const Context = createContext<IContext>(create());

let donateInterval = 0;
const donatesQueue: Donate[] = [];

export const addDonate = (value: Donate) => {
  donatesQueue.push(value);
};

const Provider = memo(({ children }: Props) => {
  const [atoms] = useState(() => create());
  const setDonate = useSetAtom(atoms.donateAtom);

  useEffect(() => {
    donateInterval = window.setInterval(() => {
      const first = donatesQueue.shift();
      if (first) {
        setDonate(first);
      }
    }, 200);

    return () => {
      clearInterval(donateInterval);
    };
  }, [setDonate]);

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as DonateAtomsCtx, Provider as DonateAtomsProvider };
