import React, { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { MinesweeperAtomsCtx, minesweeperSize, totalSeconds } from "./AtomsCtx";
import { TrovoAtomsCtx } from "../../../Services/TrovoService";
import { useOpen } from "./useOpen";
import { TwichAtomsCtx } from "../../../Services/TwichService";

const size = minesweeperSize.columns * minesweeperSize.rows;
let interval = 0;
let elepsated = 0;

export const Process = memo(() => {
  const { messageAtom } = useContext(TrovoAtomsCtx);
  const { messageAtom: messageTwichAtom } = useContext(TwichAtomsCtx);
  const { timeLeftAtom, minesweeperAtom, voteMapAtom } = useContext(MinesweeperAtomsCtx);
  const valueMap = useRef<Record<number, number>>({});

  const message = useAtomValue(messageAtom);
  const messageTwich = useAtomValue(messageTwichAtom);
  const setTimeLeft = useSetAtom(timeLeftAtom);
  const [winValue, setWinValue] = useState(0);
  const minesweeper = useAtomValue(minesweeperAtom);
  const setVoteMap = useSetAtom(voteMapAtom);
  const { open } = useOpen();

  const findItem = useCallback(() => {
    for (let i = 0; i < minesweeperSize.rows; i += 1) {
      for (let j = 0; j < minesweeperSize.columns; j += 1) {
        if (minesweeper[i][j].status === "closed" && minesweeper[i][j].value === winValue) {
          return minesweeper[i][j];
        }
      }
    }

    return null;
  }, [minesweeper, winValue]);

  useEffect(() => {
    const found = findItem();
    if (found) {
      open(found);
    }
    
    setWinValue(0);
    setVoteMap({});
    valueMap.current = {};
  }, [findItem, open, setVoteMap]);

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

  const process = useCallback((text: string) => {
    if (!text) {
      return;
    }

    const matches = /^[\d]+/.exec(text);
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
  }, [setVoteMap]);

  useEffect(() => {
    process(message.content);
  }, [message, process]);

  useEffect(() => {
    process(messageTwich.text);
  }, [messageTwich, process]);

  return null;
});
