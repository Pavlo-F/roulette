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
import { TwitchAtomsCtx } from "../../../Services/TwitchService";
import { useGetTip } from "./useGetTip";

let interval = 0;
let elepsated = 0;

export const Process = memo(() => {
  const { messageAtom } = useContext(TrovoAtomsCtx);
  const { messageAtom: messageTwichAtom } = useContext(TwitchAtomsCtx);
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
  const getTip = useGetTip();

  useEffect(() => {
    if (!winValue.value) {
      return;
    }

    if (winValue.value === "подсказка") {
      getTip();
      setWinValue({ value: "" });
      setVoteMap({});
      valueMap.current = {};
      return;
    }

    getScore(winValue.value)
      .then(data => {
        setFetchMessage("");

        if (data.data.error) {
          setFetchMessage(`Слова "${winValue.value}" нет в списке`);
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
    getTip,
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
      if (!text) {
        return;
      }

      const str = filterText(text.toLowerCase());
      if (!str) {
        return;
      }

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

function filterText(value: string) {
  if (value.includes(" ") || value.includes("хаха") || value[0] === "!" || value[0] === ":") {
    return undefined;
  }

  return value;
}
