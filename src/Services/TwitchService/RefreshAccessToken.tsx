import React, { memo, useContext, useEffect } from "react";
import { AxiosResponse } from "axios";
import { useAtom } from "jotai";
import { TwitchAtomsCtx } from "./AtomsCtx";
import { createAbortController, useAbortController } from "../../Utils/useAbortController";
import { useDonactionAxios } from "../../useDonactionAxios";

let timer = 0;

export const RefreshAccessToken = memo(() => {
  const abortControllerRef = useAbortController();
  const { accessTokenAtom } = useContext(TwitchAtomsCtx);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);

  const { instance } = useDonactionAxios();

  useEffect(() => {
    clearInterval(timer);

    timer = window.setInterval(
      () => {
        const abortController = createAbortController(abortControllerRef);

        instance
          .get<any, AxiosResponse>(`/api/twich/RefreshAccessToken`, {
            signal: abortController.signal,
            params: {
              refreshToken: accessToken.refreshToken,
            },
          })
          .then(resp => {
            setAccessToken(resp.data);
          });
      },
      (accessToken.expiresIn - 5) * 1000
    );

    return () => {
      clearInterval(timer);
    };
  }, [abortControllerRef, accessToken.expiresIn, accessToken.refreshToken, instance, setAccessToken]);

  return null;
});
