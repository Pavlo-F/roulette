import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { voteMapAtom } from "./atoms";

export const useVoteMax = () => {
  const voteMap = useAtomValue(voteMapAtom);

  const maxVote = useMemo(() => {
    let max = 0;
    Object.keys(voteMap).forEach(key => {
      if (max < voteMap[key]) {
        max = voteMap[key];
      }
    });

    const found = Object.keys(voteMap).filter(key => {
      return voteMap[key] === max;
    });

    return found;
  }, [voteMap]);

  return {
    maxVote,
  };
};
