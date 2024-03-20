import React, { memo, useEffect } from "react";
import { AxiosResponse } from "axios";
import { useAtom } from "jotai";
import { Token, tokenAtom } from "./atoms";
import { useAxios } from "./useAxios";
import { createAbortController, useAbortController } from "../../Utils/useAbortController";
import { useContextuallyService } from "./useContextuallyService";

export const ContextuallyService = memo(() => {
  const [token, setToken] = useAtom(tokenAtom);

  const abortControllerRef = useAbortController();

  const { instance } = useAxios();
  const { initRandomChallenge } = useContextuallyService();

  useEffect(() => {
    if (token.token) {
      return;
    }

    const abortController = createAbortController(abortControllerRef);

    instance
      .get<any, AxiosResponse<Token>>("/initialize_session", {
        signal: abortController.signal,
      })
      .then(data => {
        setToken({ token: data.data.token });
      });
  }, [abortControllerRef, instance, setToken, token]);

  useEffect(() => {
    if (!token.token) {
      return;
    }
    
    initRandomChallenge();
  }, [initRandomChallenge, token]);

  return null;
});
