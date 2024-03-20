import React, { memo, useCallback, useContext, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx, TableItem } from "./AtomsCtx";
import { useMove } from "./useMove";
import { useVoteMax } from "./useVoteMax";

const Root = styled.div`
  display: flex;
`;

const Rect = styled.div<{ $isFree: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: auto;
  height: 100%;
  width: 100%;
  border-radius: 16px;
  font-size: 3rem;
  border: ${props => (props.$isFree ? "none" : "1px solid var(--borderColor);")};
`;

const Vote = styled.div<{$isMax: boolean}>`
  position: absolute;
  top: 0rem;
  left: 0.5rem;
  font-size: 1rem;
  color: ${props => (props.$isMax ? "var(--secondaryColor500)" : "inherit")};
`;

type Props = {
  tableItem: TableItem;
};

export const Item = memo(({ tableItem }: Props) => {
  const { fifteenAtom, voteMapAtom } = useContext(FifteenAtomsCtx);
  const setFifteen = useSetAtom(fifteenAtom);

  const voteMap = useAtomValue(voteMapAtom);

  const { move } = useMove();
  const { maxVote } = useVoteMax();

  const vote = useMemo(() => {
    return voteMap[tableItem.value] || "";
  }, [tableItem.value, voteMap]);

  const onClick = useCallback(() => {
    const result = move(tableItem);
    if (result) {
      setFifteen(result);
    }
  }, [move, setFifteen, tableItem]);

  const isMax = useMemo(() => {
    if (!tableItem.value || !maxVote.length) {
      return false;
    }

    return maxVote.includes(tableItem.value.toString());
  }, [maxVote, tableItem.value]);

  return (
    <Root onClick={onClick}>
      <Rect $isFree={tableItem.isFree}>
        <Vote title="Проголосовало" $isMax={isMax}>{vote}</Vote>
        {!tableItem.isFree && <div>{tableItem.value}</div>}
        </Rect>
    </Root>
  );
});
