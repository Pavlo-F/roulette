import React, { useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import { FifteenAtomsCtx } from "./AtomsCtx";

export const useVoteMax = () => {
  const { voteMapAtom } = useContext(FifteenAtomsCtx);
  const voteMap = useAtomValue(voteMapAtom);

  const maxVote = useMemo(() => {
    let max = 0;
    Object.keys(voteMap).forEach(x => {
      const key = Number.parseInt(x, 10);
      if (max < voteMap[key]) {
        max = voteMap[key];
      }
    });

    const found = Object.keys(voteMap).filter(x => {
      const key = Number.parseInt(x, 10);
      return voteMap[key] === max;
    });

    return found;
  }, [voteMap]);

  return {
    maxVote,
  };
};
