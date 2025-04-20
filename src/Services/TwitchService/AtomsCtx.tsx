import React, { createContext, memo, useEffect, useMemo, useState } from "react";
import { PrimitiveAtom, atom, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { AccessToken, Chat } from "./models";
import { ServiceStatus } from "../statuses";

export const twitchClientId = "xbfg3381y83ui5sojt2cdyc0i2ud4m";
export const redirectUri =  import.meta.env.DEV ? "http://localhost:5173/settings" : "https://wheel.donaction.club/settings";
;

type IAtoms = {
  messageAtom: PrimitiveAtom<Chat>;
  connectStatusAtom: PrimitiveAtom<ServiceStatus>;
  channelUrl: string;
  codeAtom: PrimitiveAtom<string>;
  accessTokenAtom: PrimitiveAtom<AccessToken>;
  exchangeRate: number;
};

type IParams = {
  channelUrl: string;
  exchangeRate: number;
};

type IContext = IAtoms;

type Props = IParams & {
  children: React.ReactNode;
};

const create = () => {
  const r: IAtoms = {
    messageAtom: atom<Chat>({} as Chat),
    connectStatusAtom: atom<ServiceStatus>(ServiceStatus.Disconnected),
    channelUrl: "",
    codeAtom: atom<string>(""),
    accessTokenAtom: atomWithImmer<AccessToken>({} as AccessToken),
    exchangeRate: 100,
  };

  return r;
};

const Context = createContext<IContext>(create());

let commandInterval = 0;
const chatMessagesQueue: Chat[] = [];

export const addChatMessage = (value: Chat) => {
  chatMessagesQueue.push(value);
};

const Provider = memo(({ children, channelUrl, exchangeRate }: Props) => {
  const [atoms] = useState(() => create());
  const setMessage = useSetAtom(atoms.messageAtom);

  useEffect(() => {
    commandInterval = window.setInterval(() => {
      const first = chatMessagesQueue.shift();
      if (first) {
        setMessage(first);
      }
    }, 50);

    return () => {
      clearInterval(commandInterval);
    };
  }, [setMessage]);

  const ctx = useMemo(() => {
    const r: IContext = {
      ...atoms,
      channelUrl,
      exchangeRate,
    };
    return r;
  }, [atoms, channelUrl, exchangeRate]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});

export { Context as TwitchAtomsCtx, Provider as TwitchAtomsProvider };
