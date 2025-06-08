import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import type { EventSubChannelRedemptionAddEvent } from '@twurple/eventsub-base';
import { useAtomValue } from "jotai";
import { TwitchAtomsCtx, twitchClientId } from "./AtomsCtx";

type Props = {
  userName: string;
  onError: () => void;
  onMessage: (msg: EventSubChannelRedemptionAddEvent) => void;
};

export const PubSub = memo(({ userName, onMessage }: Props) => {
  const pubSubClientRef = useRef<EventSubWsListener>();
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
      const apiClient = new ApiClient({ authProvider });
      apiClient.users
        .getUserByName(userName)
        .then(user => {
          setUserId(user?.id);
        })
        .catch(err => {
          console.log(err);
        });

      apiClientRef.current = apiClient;
      pubSubClientRef.current = new EventSubWsListener({ apiClient });
      pubSubClientRef.current.start();
    }

    return () => {
      pubSubClientRef.current?.stop();
    };
  }, [authProvider, userName]);

  useEffect(() => {
    if (userId) {
      pubSubClientRef.current?.onChannelRedemptionAdd(userId, onMessage);
    }
  }, [onMessage, userId]);

  return null;
});
