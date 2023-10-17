import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { produce } from "immer";
import { useAtom } from "jotai";
import { SettingsAtomsCtx, statusMap } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";
import { ServiceStatus } from "../Services/statuses";

const donactionAxios = axios.create({
  baseURL: "https://donaction.club",
});

export const DonatePayStatus = memo(() => {
  const { donatePayStatusAtom } = useContext(DonateAtomsCtx);
  const [donatePayStatus, setDonatePayStatus] = useAtom(donatePayStatusAtom);

  const { settingsTempAtom, settingsAtom } = useContext(SettingsAtomsCtx);
  const [settingsTemp, setSettingsTemp] = useAtom(settingsTempAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const [reconnect, setReconnect] = useState(new Date());

  const reconnectCount = useRef(0);

  const donatePayApiKey = useMemo(() => {
    if (!settings.integration?.donatePayApiKey) {
      return undefined;
    }

    return settings.integration.donatePayApiKey;
  }, [settings.integration?.donatePayApiKey]);

  useEffect(() => {
    if (!donatePayApiKey) {
      setDonatePayStatus(ServiceStatus.Disconnected);
      return;
    }

    setDonatePayStatus(old => {
      if (old === ServiceStatus.Connected) {
        return ServiceStatus.Connected;
      }

      return ServiceStatus.Connecting;
    });

    donactionAxios
      .get<any, AxiosResponse>("/api/donatepay/GetUserInfo", {
        params: {
          apiKey: donatePayApiKey,
        },
      })
      .then(data => {
        reconnectCount.current = 0;

        setSettingsTemp(draft => {
          draft.integration.donateApiUserId = data.data.id;
          return draft;
        });

        setSettings(
          produce(draft => {
            draft.integration.donateApiUserId = data.data.id;
          })
        );
      })
      .catch(err => {
        window.setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log("DonatePay get user error", err);
          if (reconnectCount.current < 3) {
            reconnectCount.current += 1;
            setReconnect(new Date());
          }
        }, 10000);
      });
  }, [donatePayApiKey, reconnect, setDonatePayStatus, setSettings, setSettingsTemp]);

  return <div>{statusMap[donatePayStatus]}</div>;
});
