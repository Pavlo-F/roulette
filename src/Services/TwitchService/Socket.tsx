import React, { memo, useContext, useEffect, useMemo, useRef } from "react";
import { StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { useAtomValue, useSetAtom } from "jotai";
import { TwitchAtomsCtx, twitchClientId } from "./AtomsCtx";
import { ServiceStatus } from "../statuses";

type Props = {
  userName: string;
  onError: () => void;
  onMessage: (channel: string, user: string, text: string, msg: any) => void;
};

export const Socket = memo(({ userName, onMessage }: Props) => {
  const chatClientRef = useRef<ChatClient>();

  const { connectStatusAtom, accessTokenAtom } = useContext(TwitchAtomsCtx);
  const setConnectStatus = useSetAtom(connectStatusAtom);
  const accessToken = useAtomValue(accessTokenAtom);

  const authProvider = useMemo(() => {
    if (!accessToken.accessToken) {
      return undefined;
    }

    return new StaticAuthProvider(twitchClientId, accessToken.accessToken, ["chat:read"]);
  }, [accessToken.accessToken]);

  useEffect(() => {
    if (authProvider) {
      chatClientRef.current = new ChatClient({ authProvider, channels: [userName] });

      chatClientRef.current.onMessage(onMessage);
      chatClientRef.current.onConnect(() => {
        setConnectStatus(ServiceStatus.Connected);
      });
      chatClientRef.current.onDisconnect(() => {
        setConnectStatus(ServiceStatus.Disconnected);
      });

      chatClientRef.current.connect();
    }

    return () => {
      chatClientRef.current?.quit();
    };
  }, [authProvider, onMessage, setConnectStatus, userName]);

  return null;
});
