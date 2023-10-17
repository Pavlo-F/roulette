import React, { memo, useContext, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { FifteenAtomsCtx, fifteenSize, totalSeconds } from "./AtomsCtx";
import { useMove } from "./useMove";
import { TrovoAtomsCtx } from "../../Services/TrovoService";

let valueMap: Record<number, number> = {};
const size = fifteenSize * fifteenSize;
let interval = 0;
let elepsated = 0;

export const Process = memo(() => {
  const { messageAtom } = useContext(TrovoAtomsCtx);
  const { timeLeftAtom, winValueAtom, fifteenAtom } = useContext(FifteenAtomsCtx);

  const message = useAtomValue(messageAtom);
  const setTimeLeft = useSetAtom(timeLeftAtom);
  const [winValue, setWinValue] = useAtom(winValueAtom);
  const [fifteen, setFifteen] = useAtom(fifteenAtom);
  const { move } = useMove();

  useEffect(() => {
    const found = fifteen.data.find(x => x.value === winValue);
    if (found) {
      const result = move(found);
      if (result) {
        setFifteen(result);
        setWinValue(0);
      }
    }
  }, [fifteen.data, move, setFifteen, setWinValue, winValue]);

  useEffect(() => {
    clearInterval(interval);

    interval = window.setInterval(() => {
      elepsated += 1;

      if (elepsated >= totalSeconds) {
        let max = 0;
        let found = 0;
        Object.keys(valueMap).forEach(x => {
          const key = Number.parseInt(x, 10);
          if (max < valueMap[key]) {
            max = valueMap[key];
            found = key;
          }
        });

        valueMap = {};
        setWinValue(found);
        elepsated = 0;
        setTimeLeft(totalSeconds);
        return;
      }

      setTimeLeft(totalSeconds - elepsated);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setTimeLeft, setWinValue]);

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
      if (!valueMap[value]) {
        valueMap[value] = 0;
      }

      valueMap[value] += 1;
    }
  }, [message]);

  return null;
});
