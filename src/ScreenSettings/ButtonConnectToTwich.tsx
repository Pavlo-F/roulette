import React, { memo, useContext, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { SettingsAtomsCtx } from "./AtomsCtx";
import {
  TwichAtomsCtx,
  redirectUri,
  twichClientId,
  twichState,
} from "../Services/TwichService/AtomsCtx";
import { ServiceStatus } from "../Services/statuses";
import { createAbortController, useAbortController } from "../Utils/useAbortController";
import { ValidationContext } from "../forms/Validation";
import { useDonactionAxios } from "../useDonactionAxios";

export const ButtonConnectToTwich = memo(() => {
  const abortControllerRef = useAbortController();

  const { isInvalid } = useContext(ValidationContext);
  const { connectStatusAtom, codeAtom, accessTokenAtom } = useContext(TwichAtomsCtx);
  const { settingsAtom, settingsTempAtom } = useContext(SettingsAtomsCtx);

  const setConnectStatus = useSetAtom(connectStatusAtom);
  const setCode = useSetAtom(codeAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const settingsTemp = useAtomValue(settingsTempAtom);

  const url = useMemo(() => {
    return `https://id.twitch.tv/oauth2/authorize
?response_type=code
&client_id=${twichClientId}
&redirect_uri=${redirectUri}
&scope=chat%3Aread+user%3Aread%3Achat
&state=${twichState}`;
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const { instance } = useDonactionAxios();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || !settingsTemp.integration.twichChannel) {
      return;
    }

    setCode(code);

    const abortController = createAbortController(abortControllerRef);

    setConnectStatus(ServiceStatus.Connecting);
    instance
      .get<any, AxiosResponse>(`/api/twich/GetAccessToken`, {
        signal: abortController.signal,
        params: {
          code,
        },
      })
      .then(resp => {
        setAccessToken(resp.data);
      });
  }, [
    abortControllerRef,
    instance,
    searchParams,
    setAccessToken,
    setCode,
    setConnectStatus,
    settingsTemp.integration.twichChannel,
  ]);

  return (
    <ButtonPrimary disabled={!settingsTemp.integration.twichChannel}>
      <a href={url}>Подключить Twitch</a>
    </ButtonPrimary>
  );
});
