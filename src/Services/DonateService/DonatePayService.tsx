import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Centrifuge from "Centrifuge";
import axios, { AxiosResponse } from "axios";
import { useSetAtom } from "jotai";
import { DonateAtomsCtx } from "./AtomsCtx";
import { DonateServiceStatus } from "./models";

const tokentUrl = "https://donatepay.ru/api/v2/socket/token";

type Message = {
  data: {
    notification: {
      id: string;
      type: string;

      vars: {
        name: string;
        comment: string;
        sum: number;
        currency: string;
      };
    };
  };
};

type Props = {
  accessToken: string;
  userId: string;
};

export const DonatePayService = memo(({ accessToken, userId }: Props) => {
  const [reconnect, setReconnect] = useState<Date>(new Date());

  const centrifugeRef = useRef(
    new Centrifuge("wss://centrifugo.donatepay.ru:43002/connection/websocket", {
      subscribeEndpoint: tokentUrl,
      subscribeParams: {
        access_token: accessToken,
      },
      disableWithCredentials: true,
    })
  );

  const { donateAtom, donatePayStatusAtom } = useContext(DonateAtomsCtx);
  const setDonate = useSetAtom(donateAtom);
  const setDonatePayStatus = useSetAtom(donatePayStatusAtom);

  const centrifuge = useMemo(() => {
    return centrifugeRef.current;
  }, []);

  const getToken = useCallback(() => {
    const data = {
      access_token: accessToken,
    };

    const controller = new AbortController(); // TODO вынести в useHook

    const req = axios.post<any, AxiosResponse>(tokentUrl, data, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return req;
  }, [accessToken]);

  useEffect(() => {
    getToken()
      .then(data => {
        if (data.data.status === "error") {
          // eslint-disable-next-line no-console
          console.log("DonatePay get token error:", data.data.message);
          setDonatePayStatus(DonateServiceStatus.Error);
          return;
        }

        centrifuge.setToken(data.data.token);

        centrifuge.subscribe(`$public:${userId}`, (message: Message) => {
          if (message.data.notification.type === "donation") {
            const { id, vars } = message.data.notification;
            setDonate({
              id,
              comment: vars.comment,
              name: vars.name,
              sum: vars.sum,
              currency: vars.currency,
            });
          }
        });

        centrifuge.on("error", e => {
          window.setTimeout(() => {
            // eslint-disable-next-line no-console
            console.log("DonatePay reconnecting", e);
            setDonatePayStatus(DonateServiceStatus.Reconnecting);
            setReconnect(new Date());
          }, 5000);
        });

        centrifuge.on("connect", () => {
          setDonatePayStatus(DonateServiceStatus.Connected);
        });

        setDonatePayStatus(DonateServiceStatus.Connecting);
        centrifuge.connect();
      })
      .catch(err => {
        window.setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log("DonatePay reconnecting", err);
          setReconnect(new Date());
        }, 5000);
      });

    return () => {
      centrifuge.removeAllListeners();
    };
  }, [centrifuge, getToken, setDonate, reconnect, setReconnect, userId, setDonatePayStatus]);

  return null;
});
