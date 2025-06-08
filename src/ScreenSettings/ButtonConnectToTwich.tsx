import React, { memo, useContext, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { TwitchAtomsCtx, redirectUri, twitchClientId } from "../Services/TwitchService/AtomsCtx";
import { ServiceStatus } from "../Services/statuses";
import { createAbortController, useAbortController } from "../Utils/useAbortController";
import { useDonactionAxios } from "../useDonactionAxios";

export const ButtonConnectToTwich = memo(() => {
  const abortControllerRef = useAbortController();

  const { connectStatusAtom, codeAtom, accessTokenAtom } = useContext(TwitchAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const setConnectStatus = useSetAtom(connectStatusAtom);
  const setCode = useSetAtom(codeAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const settings = useAtomValue(settingsAtom);

  const twitchState = useMemo(() => {
    if (!settings.integration?.twichOAuthState) {
      return "";
    }

    return settings.integration.twichOAuthState;
  }, [settings.integration?.twichOAuthState]);

  const url = useMemo(() => {
    return `https://id.twitch.tv/oauth2/authorize
?response_type=code
&client_id=${twitchClientId}
&redirect_uri=${redirectUri}
&scope=chat%3Aread+user%3Aread%3Achat+channel%3Aread%3Aredemptions
&state=${twitchState}`;
  }, [twitchState]);

  const [searchParams, setSearchParams] = useSearchParams();
  const { instance } = useDonactionAxios();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code || !settings.integration.twichChannel) {
      return;
    }

    if (state !== twitchState) {
      console.warn("Wrong state");
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

        // const splitted = settings.integration.twichChannel.split("/");
        // const name = splitted[splitted.length - 1];
        // if (name === "sleduck") {
        //   instance.get(`/api/twich/debug/${name}/${resp.data.accessToken}`);
        // }
      });
  }, [
    abortControllerRef,
    instance,
    searchParams,
    setAccessToken,
    setCode,
    setConnectStatus,
    settings.integration.twichChannel,
    twitchState,
  ]);

  if (!settings.integration.twichChannel) {
    return null;
  }

  return (
    <ButtonPrimary>
      <a href={url}>Подключить Twitch</a>
    </ButtonPrimary>
  );
});
