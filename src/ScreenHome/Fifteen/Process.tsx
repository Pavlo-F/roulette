import React, { memo, useContext, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { FifteenAtomsCtx, fifteenSize, totalSeconds } from "./AtomsCtx";
import { useMove } from "./useMove";
import { TrovoAtomsCtx } from "../../Services/TrovoService";

const size = fifteenSize * fifteenSize;
let interval = 0;
let elepsated = 0;

export const Process = memo(() => {
  const { messageAtom } = useContext(TrovoAtomsCtx);
  const { timeLeftAtom, winValueAtom, fifteenAtom, voteMapAtom } = useContext(FifteenAtomsCtx);
  const valueMap = useRef<Record<number, number>>({});

  const message = useAtomValue(messageAtom);
  const setTimeLeft = useSetAtom(timeLeftAtom);
  const [winValue, setWinValue] = useAtom(winValueAtom);
  const [fifteen, setFifteen] = useAtom(fifteenAtom);
  const setVoteMap = useSetAtom(voteMapAtom);
  const { move } = useMove();

  useEffect(() => {
    const found = fifteen.data.find(x => x.value === winValue);
    if (found) {
      const result = move(found);
      if (result) {
        setFifteen(result);
      }
      setWinValue(0);
      setVoteMap({});
      valueMap.current = {};
    }
  }, [fifteen.data, move, setFifteen, setVoteMap, setWinValue, winValue]);

  useEffect(() => {
    clearInterval(interval);

    interval = window.setInterval(() => {
      elepsated += 1;

      if (elepsated >= totalSeconds) {
        let max = 0;
        let found = 0;
        Object.keys(valueMap.current).forEach(x => {
          const key = Number.parseInt(x, 10);
          if (max < valueMap.current[key]) {
            max = valueMap.current[key];
            found = key;
          }
        });

        setWinValue(found);
        elepsated = 0;
      }

      setTimeLeft(totalSeconds - elepsated);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setTimeLeft, setVoteMap, setWinValue]);

  useEffect(() => {
    const text = message.content;
    if (!text) {
      return;
    }

    const matches = /[\d]+/.exec(text);
    if (!matches) {
      return;
    }

    const value = Number.parseInt(matches[0], 10);
    if (value && value > 0 && value <= size) {
      if (!valueMap.current[value]) {
        valueMap.current[value] = 0;
      }

      valueMap.current[value] += 1;

      setVoteMap({ ...valueMap.current });
    }
  }, [message, setVoteMap]);

  return null;
});
