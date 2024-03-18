import React, { FC, createContext, memo, useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";
import { ServiceStatus } from "../Services/statuses";

export const statusMap: Record<ServiceStatus, string> = {
  [ServiceStatus.Connecting]: "Подключение",
  [ServiceStatus.Connected]: "Подключен",
  [ServiceStatus.Reconnecting]: "Переподключение...",
  [ServiceStatus.Disconnected]: "Отключен",
  [ServiceStatus.Error]: "Ошибка подключения",
};

export enum Games {
  Fifteen = "Fifteen",
  Minesweeper = "Minesweeper",
}

export type Settings = {
  timer: {
    defaultMinutes: number;
    addSeconds: number;
    timeForNewPosition: number;
    timeByDonate: number;
    thresholdToAddTime: number;
  };
  integration: {
    donatePayApiKey: string;
    donateApiUserId: string;

    donationAlertsWidgetUrl: string;

    trovoChannel: string;
    
    twichChannel: string;
    twichOAuthState: string;
    twitchExchangeRate: number;

    game: Games;
  };
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
    timeByDonate: 0,
    thresholdToAddTime: 500,
  },
  integration: {
    donatePayApiKey: "",
    donateApiUserId: "",

    donationAlertsWidgetUrl: "",

    trovoChannel: "",

    twichChannel: "",
    twichOAuthState: new Date().getTime().toString(),
    twitchExchangeRate: 100,

    game: Games.Minesweeper,
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

  const [settings, setSettings] = useAtom(atoms.settingsAtom);
  const setSettingsTemp = useSetAtom(atoms.settingsTempAtom);

  useEffect(() => {
    setSettingsTemp(settings);
  }, [setSettingsTemp, settings]);

  useEffect(() => {
    setSettings(
      produce(draft => {
        if (!draft.integration.twichOAuthState) {
          draft.integration.twichOAuthState = new Date().getTime().toString();
        }

        if (!draft.integration.twitchExchangeRate) {
          draft.integration.twitchExchangeRate = 100;
        }

        return draft;
      })
    );
  }, [setSettings]);

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
