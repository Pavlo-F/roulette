import React, { createContext, memo, useMemo, useState } from "react";
import { PrimitiveAtom, atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { DonatePaySocketTokens, DonateServiceStatus } from "./models";

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

export { Context as DonateAtomsCtx, Provider as DonateAtomsProvider };
