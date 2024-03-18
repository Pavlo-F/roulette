import React, { createContext, memo, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, atom, useSetAtom } from "jotai";
import { ServiceStatus } from "../statuses";

export enum DonateSource {
  DonatePay,
  DonationAlerts,
  Twitch,
}

export type Donate = {
  id: string;
  name: string;
  comment: string;
  sum: number;
  currency: string;
  date: string;
  source: DonateSource;
};

type IAtoms = {
  donateAtom: PrimitiveAtom<Donate>;
  donateListAtom: PrimitiveAtom<Donate[]>;
  donatePayStatusAtom: PrimitiveAtom<ServiceStatus>;
  donationAlertsStatusAtom: PrimitiveAtom<ServiceStatus>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    donateAtom: atom<Donate>({} as Donate),
    donateListAtom: atom<Donate[]>([]),
    donatePayStatusAtom: atom<ServiceStatus>(ServiceStatus.Disconnected),
    donationAlertsStatusAtom: atom<ServiceStatus>(ServiceStatus.Disconnected),
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
  const setDonateList = useSetAtom(atoms.donateListAtom);

  useEffect(() => {
    donateInterval = window.setInterval(() => {
      const first = donatesQueue.shift();
      if (first) {
        setDonate(first);
        setDonateList(old => {
          return [first, ...old];
        });
      }
    }, 200);

    return () => {
      clearInterval(donateInterval);
    };
  }, [setDonate, setDonateList]);

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as DonateAtomsCtx, Provider as DonateAtomsProvider };

export const convertCodes = (str: string) => {
  if (!str) {
    return str;
  }

  let result = str;
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&gt;/g, ">");
  result = result.replace(/&lt;/g, "<");
  result = result.replace(/&quot;/g, '"');
  result = result.replace(/&#039;/g, "'");
  return result;
};
