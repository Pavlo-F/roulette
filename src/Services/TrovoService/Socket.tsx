import React, { memo, useContext, useEffect, useMemo, useRef } from "react";
import useWebSocket from "react-use-websocket";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { TrovoAtomsCtx } from "./AtomsCtx";
import { Chat, ChatMessage, MessageTypesEnum } from "./models";
import { ServiceStatus } from "../statuses";

type Props = {
  chatToken: string;
  onError: () => void;
  onMessage: (chats: Chat[]) => void;
};

export const Socket = memo(({ chatToken, onError, onMessage }: Props) => {
  const didUnmount = useRef(false);
  const isFirstMessagesSkiped = useRef(false);

  const { connectStatusAtom } = useContext(TrovoAtomsCtx);
  const setConnectStatus = useSetAtom(connectStatusAtom);

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  const nonce = useMemo(() => {
    return `AUTH_${dayjs().format("DDMMYYYY_HH-mm-ss")}`;
  }, []);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "wss://open-chat.trovo.live/chat",
    {
      onOpen() {
        const connectMsg = {
          type: MessageTypesEnum.Auth,
          nonce,
          data: {
            token: chatToken,
          },
        };

        sendJsonMessage(connectMsg);
      },
      onError(event) {
        console.log(event);
        onError?.();
      },
      onMessage(event) {
        const msg = JSON.parse(event.data) as ChatMessage;
        if (!msg) {
          return;
        }

        if (msg.error) {
          console.error("Trovo error", msg.error);
          onError?.();
          return;
        }

        if (msg.type === MessageTypesEnum.Response) {
          setConnectStatus(ServiceStatus.Connected);
        } else if (msg.type === MessageTypesEnum.Chat) {
          if (isFirstMessagesSkiped.current) {
            onMessage?.(msg.data.chats);
          }

          isFirstMessagesSkiped.current = true;
        }
      },
      heartbeat: {
        message: JSON.stringify({
          type: MessageTypesEnum.Ping,
          nonce,
        }),
        returnMessage: "pong",
        timeout: 60000, // 1 minute, if no response is received, the connection will be closed
        interval: 25000, // every 25 seconds, a ping message will be sent
      },
    }
  );

  return null;
});
