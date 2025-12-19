import React, { memo, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import styled from "styled-components";
import { createAbortController, useAbortController } from "../Utils/useAbortController";
import { useDonactionAxios } from "../useDonactionAxios";

const Textarea = styled.textarea`
  width: 70%;
  height: 4rem;
`;

export const Screen = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { instance } = useDonactionAxios();
  const abortControllerRef = useAbortController();
  const [accessToken, setAccessToken] = useState("");

  const copy = useCallback(() => {
    navigator.clipboard.writeText(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      return;
    }

    const abortController = createAbortController(abortControllerRef);

    instance
      .get<any, AxiosResponse>(`/api/twich/GetAccessToken`, {
        signal: abortController.signal,
        params: {
          code,
        },
      })
      .then(resp => {
        setAccessToken(window.btoa(JSON.stringify(resp.data)));
      });
  }, [abortControllerRef, instance, searchParams]);

  return (
    <div>
      <Textarea readOnly value={accessToken} />
      <div>
        <button type="button" onClick={copy}>Скопировать</button>
      </div>
    </div>
  );
});
