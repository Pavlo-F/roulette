import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Centrifuge from "Centrifuge";
import axios, { AxiosResponse } from "axios";
import { useSetAtom } from "jotai";
import { DonateAtomsCtx, DonateSource, addDonate, convertCodes } from "./AtomsCtx";
import { createAbortController, useAbortController } from "../../Utils/useAbortController";
import { ServiceStatus } from "../statuses";

const tokentUrl = "https://donatepay.ru/api/v2/socket/token";

type Vars = {
  name: string;
  comment: string;
  sum: number;
};

type Message = {
  data: {
    type: string;
    notification: {
      id: string;
      type: string;
      created_at: string;
      vars: string;

      transaction: {
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
  const abortControllerRef = useAbortController();

  const centrifugeRef = useRef(
    new Centrifuge("wss://centrifugo.donatepay.ru:43002/connection/websocket", {
      subscribeEndpoint: tokentUrl,
      subscribeParams: {
        access_token: accessToken,
      },
      disableWithCredentials: true,
    })
  );

  const { donatePayStatusAtom } = useContext(DonateAtomsCtx);
  const setDonatePayStatus = useSetAtom(donatePayStatusAtom);

  const centrifuge = useMemo(() => {
    return centrifugeRef.current;
  }, []);

  const getToken = useCallback(() => {
    const data = {
      access_token: accessToken,
    };

    const abortController = createAbortController(abortControllerRef);

    const req = axios.post<any, AxiosResponse>(tokentUrl, data, {
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return req;
  }, [accessToken, abortControllerRef]);

  useEffect(() => {
    getToken()
      .then(data => {
        if (data.data.status === "error") {
          // eslint-disable-next-line no-console
          console.log("DonatePay get token error:", data.data.message);
          setDonatePayStatus(ServiceStatus.Error);
          return;
        }

        centrifuge.setToken(data.data.token);

        centrifuge.subscribe(`notifications#${userId}`, (message: Message) => {
          if (message.data.notification.type === "donation") {
            const { id, transaction, vars, created_at: created } = message.data.notification;
            const parcedVars: Vars = JSON.parse(vars);
            addDonate({
              id,
              comment: convertCodes(parcedVars.comment),
              name: parcedVars.name,
              sum: parcedVars.sum,
              currency: transaction.currency,
              date: created,
              source: DonateSource.DonatePay,
            });
          }
        });

        centrifuge.on("error", e => {
          window.setTimeout(() => {
            // eslint-disable-next-line no-console
            console.log("DonatePay reconnecting", e);
            setDonatePayStatus(ServiceStatus.Reconnecting);
            setReconnect(new Date());
          }, 5000);
        });

        centrifuge.on("connect", () => {
          setDonatePayStatus(ServiceStatus.Connected);
        });

        setDonatePayStatus(ServiceStatus.Connecting);
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
  }, [centrifuge, getToken, reconnect, setReconnect, userId, setDonatePayStatus]);

  return null;
});
