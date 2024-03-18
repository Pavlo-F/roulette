import React, { memo, useCallback, useContext, useMemo } from "react";
import { ChatMessage } from "@twurple/chat";
import { PubSubRedemptionMessage } from "@twurple/pubsub";
import { useAtomValue, useSetAtom } from "jotai";
import { TwichAtomsCtx, addChatMessage } from "./AtomsCtx";
import { PubSub } from "./PubSub";
import { RefreshAccessToken } from "./RefreshAccessToken";
import { Socket } from "./Socket";
import { DonateSource, addDonate } from "../DonateService/AtomsCtx";
import { ServiceStatus } from "../statuses";

export const TwichService = memo(() => {
  const { connectStatusAtom, channelUrl, accessTokenAtom, exchangeRate } =
    useContext(TwichAtomsCtx);
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

  const onMessagePubSub = useCallback((msg: PubSubRedemptionMessage) => {
    if (msg.status === "FULFILLED") {
      return;
    }
    
    const sum = Math.round(msg.rewardCost / (exchangeRate || 1));
    addDonate({
      comment: msg.message,
      currency: "руб",
      date: msg.redemptionDate.toJSON(),
      id: msg.redemptionDate.getTime().toString(),
      name: msg.userDisplayName,
      source: DonateSource.Twitch,
      sum,
    });
  }, [exchangeRate]);

  return (
    <>
      {accessToken.accessToken && userName && (
        <>
          <Socket userName={userName} onError={onError} onMessage={onMessage} />
          <PubSub userName={userName} onError={onError} onMessage={onMessagePubSub} />
          <RefreshAccessToken />
        </>
      )}
    </>
  );
});
