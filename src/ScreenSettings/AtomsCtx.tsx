import React, { FC, createContext, memo, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomWithImmer } from "jotai-immer";
import { DonateServiceStatus } from "../Services/DonateService/models";

export const statusMap: Record<DonateServiceStatus, string> = {
  [DonateServiceStatus.Connecting]: "Подключение",
  [DonateServiceStatus.Connected]: "Подключен",
  [DonateServiceStatus.Reconnecting]: "Переподключение...",
  [DonateServiceStatus.Disconnected]: "Отключен",
  [DonateServiceStatus.Error]: "Ошибка подключения",
};

export type Settings = {
  timer: {
    defaultMinutes: number;
    addSeconds: number;
    timeForNewPosition: number;
  },
  integration: {
    donatePayApiKey: string;
    donateApiUserId: string;

    donationAlertsWidgetUrl: string;
  },
};

type IAtoms = {
  settingsAtom: PrimitiveAtom<Settings>;
  settingsTempAtom: PrimitiveAtom<Settings>;
};

type IContext = IAtoms;

type Props = {
  children: React.ReactNode;
};

const defaultSettings = {
  timer: {
    defaultMinutes: 10,
    addSeconds: 60,
    timeForNewPosition: 60,
  },
  integration: {
    donatePayApiKey: "",
    donateApiUserId: "",
    
    donationAlertsWidgetUrl: "",
  },
};

const create = () => {
  const r: IAtoms = {
    settingsAtom: atomWithStorage<Settings>("settings", defaultSettings),
    settingsTempAtom: atomWithImmer<Settings>(defaultSettings),
  };

  return r;
};

const Context = createContext<IContext>(create());

const Provider = memo(({ children }: Props) => {
  const [atoms] = useState(() => create());

  const settings = useAtomValue(atoms.settingsAtom);
  const setSettingsTemp = useSetAtom(atoms.settingsTempAtom);
  
  useEffect(() => {
    const check = settings as Settings;
    setSettingsTemp(check);
  }, [setSettingsTemp, settings]);

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
    };
    return r;
  }, [atoms]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as SettingsAtomsCtx, Provider as SettingsAtomsProvider };

export function withProvider(Component: FC): FC {
  return ({ ...props }) => (
    <Provider>
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Provider>
  );
}
