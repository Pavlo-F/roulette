import React, { memo, useCallback, useContext, useMemo } from "react";
import { ChatMessage } from "@twurple/chat";
import { useAtomValue, useSetAtom } from "jotai";
import { TwichAtomsCtx, addChatMessage } from "./AtomsCtx";
import { RefreshAccessToken } from "./RefreshAccessToken";
import { Socket } from "./Socket";
import { ServiceStatus } from "../statuses";

export const TwichService = memo(() => {
  const { connectStatusAtom, channelUrl, accessTokenAtom } = useContext(TwichAtomsCtx);
  const setConnectStatus = useSetAtom(connectStatusAtom);
  const accessToken = useAtomValue(accessTokenAtom);

  const userName: string = useMemo(() => {
    if (!channelUrl) {
      return "";
    }

    const splited = channelUrl.split("/");
    const result = splited[splited.length - 1];

    return result;
  }, [channelUrl]);

  const onError = useCallback(() => {
    if (!userName) {
      return;
    }

    setConnectStatus(ServiceStatus.Reconnecting);
  }, [setConnectStatus, userName]);

  const onMessage = useCallback((channel: string, user: string, text: string, msg: ChatMessage) => {
    if (text) {
      addChatMessage({ channel, user, text, msg });
    }
  }, []);

  return (
    <>
      {accessToken.accessToken && userName && (
        <>
          <Socket userName={userName} onError={onError} onMessage={onMessage} />
          <RefreshAccessToken />
        </>
      )}
    </>
  );
});
