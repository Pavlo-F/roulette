import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { PubSubClient, PubSubRedemptionMessage } from "@twurple/pubsub";
import { useAtomValue } from "jotai";
import { TwitchAtomsCtx, twitchClientId } from "./AtomsCtx";

type Props = {
  userName: string;
  onError: () => void;
  onMessage: (msg: PubSubRedemptionMessage) => void;
};

export const PubSub = memo(({ userName, onMessage }: Props) => {
  const pubSubClientRef = useRef<PubSubClient>();
  const apiClientRef = useRef<ApiClient>();
  const [userId, setUserId] = useState<string>();

  const { accessTokenAtom } = useContext(TwitchAtomsCtx);
  const accessToken = useAtomValue(accessTokenAtom);

  const authProvider = useMemo(() => {
    if (!accessToken.accessToken) {
      return undefined;
    }

    return new StaticAuthProvider(twitchClientId, accessToken.accessToken, [
      "channel:read:redemptions",
    ]);
  }, [accessToken.accessToken]);

  useEffect(() => {
    if (authProvider) {
      pubSubClientRef.current = new PubSubClient({ authProvider });
      apiClientRef.current = new ApiClient({ authProvider });
      apiClientRef.current.users.getUserByName(userName).then(user => {
        setUserId(user?.id);
      }).catch(err => {
        console.log(err);
      });
    }

    return () => {
      pubSubClientRef.current?.removeAllHandlers();
    };
  }, [authProvider, userName]);

  useEffect(() => {
    if (userId) {
      pubSubClientRef.current?.onRedemption(userId, onMessage);
    }
  }, [onMessage, userId]);

  return null;
});
