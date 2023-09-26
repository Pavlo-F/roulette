import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSetAtom } from "jotai";
// @ts-ignore
import io from "socket.io-client";
import { DonateAtomsCtx, addDonate } from "./AtomsCtx";
import { DonateServiceStatus } from "./models";

type Message = {
  id: string;
  username: string;
  amount: number;
  currency: string;
  message: string;
};

type Props = {
  accessToken: string;
};

export const DonationAlertsService = memo(({ accessToken }: Props) => {
  const [reconnect, setReconnect] = useState<Date>(new Date());

  const ioRef = useRef(io("wss://socket.donationalerts.ru"));

  const { donationAlertsStatusAtom } = useContext(DonateAtomsCtx);
  const setDdonationAlertsStatus = useSetAtom(donationAlertsStatusAtom);

  const ioClient = useMemo(() => {
    return ioRef.current;
  }, []);

  useEffect(() => {
    if (ioClient) {
      ioClient.on("connect", () => {
        setDdonationAlertsStatus(DonateServiceStatus.Connected);
        ioClient.emit("add-user", { token: accessToken, type: "alert_widget" });
      });

      ioClient.on("donation", (data: any) => {
        const msg = JSON.parse(data) as Message;
        addDonate({
          id: msg.id,
          comment: msg.message,
          name: msg.username,
          sum: msg.amount,
          currency: msg.currency,
        });
      });

      ioClient.on("error", (err: any) => {
        window.setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log("DonationAlerts reconnecting", err);
          setReconnect(new Date());
        }, 5000);
      });

      setDdonationAlertsStatus(DonateServiceStatus.Connecting);
      ioClient.connect();
    }

    return () => {
      ioClient?.disconnect();
    };
  }, [accessToken, ioClient, reconnect, setDdonationAlertsStatus]);

  return null;
});
