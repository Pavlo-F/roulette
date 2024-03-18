import React, { useCallback } from "react";
import { AxiosResponse } from "axios";
import { useAtom } from "jotai";
import { Challenge, challengeAtom, tokenAtom } from "./atoms";
import { ScoreRequest, ScoreResponce } from "./models";
import { useAxios } from "./useAxios";
import { createAbortController, useAbortController } from "../../Utils/useAbortController";

export const useContextuallyService = () => {
  const [token, setToken] = useAtom(tokenAtom);
  const [challenge, setChallenge] = useAtom(challengeAtom);

  const abortControllerChalengeRef = useAbortController();
  const abortControllerScoreRef = useAbortController();

  const { instance } = useAxios();

  const initRandomChallenge = useCallback(() => {
    const abortController = createAbortController(abortControllerChalengeRef);

    instance
      .get<any, AxiosResponse<Challenge>>("/get_random_challenge", {
        signal: abortController.signal,
        params: {
          user_id: token.token,
        },
      })
      .then(data => {
        setChallenge(data.data);
      });
  }, [abortControllerChalengeRef, instance, setChallenge, token]);

  const getScore = useCallback(
    (word: string) => {
      const abortController = createAbortController(abortControllerScoreRef);

      const params: ScoreRequest = {
        challenge_id: challenge.id,
        challenge_type: "random",
        user_id: token.token,
        word,
      };

      const req = instance.get<any, AxiosResponse<ScoreResponce>>("/get_score", {
        signal: abortController.signal,
        params,
      });

      return req;
    },
    [abortControllerScoreRef, challenge.id, token, instance]
  );

  return {
    getScore,
    initRandomChallenge,
  };
};
