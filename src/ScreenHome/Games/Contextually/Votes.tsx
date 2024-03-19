import React, { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { voteMapAtom } from "./atoms";
import { useVoteMax } from "./useVoteMax";

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.5rem;
`;

const Vote = styled.div<{ $isMax: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => (props.$isMax ? "var(--secondaryColor500)" : "inherit")};
`;

const MaxMsg = styled.div`
  max-width: 10rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Votes = memo(() => {
  const voteMap = useAtomValue(voteMapAtom);

  const top5 = useMemo(() => {
    const result = Object.keys(voteMap).map(key => {
      return { word: key, votes: voteMap[key] };
    });

    const sorted = result.sort((a, b) => b.votes - a.votes);
    if (sorted?.length) {
      return sorted.slice(0, 5);
    }

    return [];
  }, [voteMap]);

  const { maxVote } = useVoteMax();

  return (
    <Root>
      {top5.map(x => {
        return (
          <Vote key={x.word} $isMax={maxVote.includes(x.word)}>
            <MaxMsg>{x.word}</MaxMsg>{": "}{x.votes}
          </Vote>
        );
      })}
    </Root>
  );
});
