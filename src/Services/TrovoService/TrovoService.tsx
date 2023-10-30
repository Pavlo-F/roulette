import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AxiosResponse } from "axios";
import { useSetAtom } from "jotai";
import { TrovoAtomsCtx, addChatMessage } from "./AtomsCtx";
import { Socket } from "./Socket";
import { Chat, ChatTypes, User } from "./models";
import { createAbortController, useAbortController } from "../../Utils/useAbortController";
import { ServiceStatus } from "../statuses";
import { useDonactionAxios } from "../../useDonactionAxios";

export const TrovoService = memo(() => {
  const { connectStatusAtom } = useContext(TrovoAtomsCtx);
  const setConnectStatus = useSetAtom(connectStatusAtom);

  const abortControllerRef = useAbortController();
  const tokenAbortControllerRef = useAbortController();

  const { channelUrl } = useContext(TrovoAtomsCtx);
  const { instance } = useDonactionAxios();

  const [user, setUser] = useState<User>();
  const [chatToken, setChatToken] = useState("");

  const getUserInfo = useCallback(
    (userName: string) => {
      if (!userName) {
        return Promise.reject();
      }

      const abortController = createAbortController(abortControllerRef);

      const req = instance.get<any, AxiosResponse>(`/api/trovo/GetUserInfo`, {
        signal: abortController.signal,
        params: {
          userName,
        },
      });

      return req;
    },
    [abortControllerRef, instance]
  );

  const getChatToken = useCallback(
    (channelId: string) => {
      if (!channelId) {
        return Promise.reject();
      }

      const abortController = createAbortController(tokenAbortControllerRef);

      const req = instance.get<any, AxiosResponse>(`/api/trovo/GetChatToken`, {
        signal: abortController.signal,
        params: {
          channelId,
        },
      });

      return req;
    },
    [instance, tokenAbortControllerRef]
  );

  const userName: string = useMemo(() => {
    if (!channelUrl) {
      return "";
    }

    const splited = channelUrl.split("/");
    const result = splited[splited.length - 1];

    return result;
  }, [channelUrl]);

  useEffect(() => {
    if (!userName) {
      return;
    }

    setConnectStatus(ServiceStatus.Connecting);

    getUserInfo(userName)
      .then(data => {
        const respUser = data.data[0] as User;
        setUser(respUser);
        getChatToken(respUser.channelId).then(resp => {
          setChatToken(resp.data.token);
        });
      })
      .catch(err => {
        setConnectStatus(ServiceStatus.Error);
        console.log(err);
      });
  }, [getChatToken, getUserInfo, setConnectStatus, userName]);

  const onError = useCallback(() => {
    if (!user) {
      return;
    }

    setConnectStatus(ServiceStatus.Reconnecting);

    getChatToken(user.channelId).then(resp => {
      setChatToken(resp.data.token);
    });
  }, [getChatToken, setConnectStatus, user]);

  const onMessage = useCallback((chats: Chat[]) => {
    chats.forEach(x => {
      if (x.type === ChatTypes.Normal) {
        addChatMessage(x);
      }
    });

  }, []);

  return <>{chatToken && <Socket chatToken={chatToken} onError={onError} onMessage={onMessage} />}</>;
});
