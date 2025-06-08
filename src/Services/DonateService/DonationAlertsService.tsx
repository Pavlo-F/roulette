import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSetAtom } from "jotai";
// @ts-ignore
import io from "socket.io-client";
import { DonateAtomsCtx, DonateSource, addDonate, convertCodes } from "./AtomsCtx";
import { ServiceStatus } from "../statuses";

type Message = {
  id: number;
  username: string;
  amount: number;
  currency: string;
  message: string;
  date_created: string;
  alert_type: number;
};

type Props = {
  accessToken: string;
};

let prevId = 0;

export const DonationAlertsService = memo(({ accessToken }: Props) => {
  const [reconnect, setReconnect] = useState<Date>(new Date());

  const ioRef = useRef(io("wss://socket.donationalerts.ru", {
    autoConnect: false,
  }));

  const { donationAlertsStatusAtom } = useContext(DonateAtomsCtx);
  const setDdonationAlertsStatus = useSetAtom(donationAlertsStatusAtom);

  const ioClient = useMemo(() => {
    return ioRef.current;
  }, []);

  useEffect(() => {
    if (ioClient) {
      ioClient.on("connect", () => {
        setDdonationAlertsStatus(ServiceStatus.Connected);
        ioClient.emit("add-user", { token: accessToken, type: "alert_widget" });
      });

      ioClient.on("donation", (data: any) => {
        const msg = JSON.parse(data) as Message;

        if (msg.alert_type !== 1 || prevId === msg.id) {
          return;
        };

        prevId = msg.id;

        addDonate({
          id: msg.id.toString(),
          comment: convertCodes(msg.message),
          name: msg.username,
          sum: typeof msg.amount === "string" ? Number.parseFloat(msg.amount) : msg.amount,
          currency: msg.currency,
          date: `${msg.date_created.replace(" ", "T")}Z`,
          source: DonateSource.DonationAlerts,
        });
      });

      ioClient.on("error", (err: any) => {
        window.setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log("DonationAlerts reconnecting", err);
          setReconnect(new Date());
        }, 5000);
      });

      setDdonationAlertsStatus(ServiceStatus.Connecting);
      ioClient.connect();
    }

    return () => {
      ioClient?.removeAllListeners();
      ioClient?.disconnect();
    };
  }, [accessToken, ioClient, reconnect, setDdonationAlertsStatus]);

  return null;
});
