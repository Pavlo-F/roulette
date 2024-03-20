import React, { memo, useCallback, useContext, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  contextuallyAtom,
  fetchMessageAtom,
  showWinWindowAtom,
  timeLeftAtom,
  totalSeconds,
  voteMapAtom,
  winValueAtom,
} from "./atoms";
import { useContextuallyService } from "../../../Services/ContextuallyService";
import { TrovoAtomsCtx } from "../../../Services/TrovoService";
import { TwichAtomsCtx } from "../../../Services/TwichService";

let interval = 0;
let elepsated = 0;

export const Process = memo(() => {
  const { messageAtom } = useContext(TrovoAtomsCtx);
  const { messageAtom: messageTwichAtom } = useContext(TwichAtomsCtx);
  const valueMap = useRef<Record<string, number>>({});

  const message = useAtomValue(messageAtom);
  const messageTwich = useAtomValue(messageTwichAtom);
  const setTimeLeft = useSetAtom(timeLeftAtom);
  const [winValue, setWinValue] = useAtom(winValueAtom);
  const showWinWindow = useSetAtom(showWinWindowAtom);
  const setContextually = useSetAtom(contextuallyAtom);
  const setVoteMap = useSetAtom(voteMapAtom);
  const setFetchMessage = useSetAtom(fetchMessageAtom);

  const { getScore } = useContextuallyService();

  useEffect(() => {
    if (!winValue.value) {
      return;
    }

    getScore(winValue.value)
      .then(data => {
        setFetchMessage("");

        if (data.data.error) {
          setFetchMessage("Нет такого слова в списке");
          setTimeout(() => {
            setFetchMessage("");
          }, 3000);
          return;
        }

        if (data.data.completed) {
          showWinWindow(data.data);
        }

        setContextually(draft => {
          const result = [...draft];
          result.push({ ...data.data, id: new Date().getTime().toString() });
          return result;
        });
      })
      .finally(() => {
        setWinValue({ value: "" });
        setVoteMap({});
        valueMap.current = {};
      });
  }, [
    getScore,
    setContextually,
    setFetchMessage,
    setVoteMap,
    setWinValue,
    showWinWindow,
    winValue.value,
  ]);

  useEffect(() => {
    clearInterval(interval);

    interval = window.setInterval(() => {
      elepsated += 1;

      if (elepsated >= totalSeconds) {
        let max = 0;
        let found = "";
        Object.keys(valueMap.current).forEach(key => {
          if (max < valueMap.current[key]) {
            max = valueMap.current[key];
            found = key;
          }
        });

        setWinValue({ value: found });
        elepsated = 0;
      }

      setTimeLeft(totalSeconds - elepsated);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setTimeLeft, setVoteMap, setWinValue]);

  const process = useCallback(
    (text: string) => {
      if (!text || (text && text.split(" ").length > 1)) {
        return;
      }

      const str = text.toLowerCase();

      if (!valueMap.current[str]) {
        valueMap.current[str] = 0;
      }

      valueMap.current[str] += 1;

      setVoteMap({ ...valueMap.current });
    },
    [setVoteMap]
  );

  useEffect(() => {
    process(message.content);
  }, [message, process]);

  useEffect(() => {
    process(messageTwich.text);
  }, [messageTwich, process]);

  return null;
});
