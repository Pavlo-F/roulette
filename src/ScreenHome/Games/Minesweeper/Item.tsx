import React, { memo, useCallback, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { MinesweeperAtomsCtx, TableItem } from "./AtomsCtx";
import SvgBomb from "./bomb.svg";
import { useOpen } from "./useOpen";
import { useVoteMax } from "./useVoteMax";

const Root = styled.div`
  display: flex;
`;

const Rect = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: auto;
  font-size: 1rem;
`;

const Mine = styled.div`
  width: 26px;
  height: 26px;
  color: var(--invalid);
`;

const Vote = styled.div<{ $isMax: boolean }>`
  position: absolute;
  top: -0.5rem;
  left: 0rem;
  font-size: 0.7rem;
  color: ${props => (props.$isMax ? "var(--secondaryColor500)" : "inherit")};
`;

const MineCount = styled.div`
  color: #fff;
`;

type Props = {
  tableItem: TableItem;
};

export const Item = memo(({ tableItem }: Props) => {
  const { voteMapAtom } = useContext(MinesweeperAtomsCtx);

  const voteMap = useAtomValue(voteMapAtom);

  const { maxVote } = useVoteMax();
  const { open, getNeighbours } = useOpen();

  const vote = useMemo(() => {
    return voteMap[tableItem.value] || "";
  }, [tableItem.value, voteMap]);

  const onClick = useCallback(() => {
    open(tableItem);
  }, [open, tableItem]);

  const isMax = useMemo(() => {
    if (!tableItem.value || !maxVote.length) {
      return false;
    }

    return maxVote.includes(tableItem.value.toString());
  }, [maxVote, tableItem.value]);

  const mineCount = useMemo(() => {
    return getNeighbours(tableItem).filter(x => !!x && x.isMine).length;
  }, [getNeighbours, tableItem]);

  return (
    <Root onClick={onClick}>
      <Rect>
        <Vote title="Проголосовало" $isMax={isMax}>
          {vote}
        </Vote>
        {tableItem.status === "opened" && (
          <>
            {tableItem.isMine ? (
              <Mine>
                <SvgBomb />
              </Mine>
            ) : (
              <MineCount>{mineCount || ""}</MineCount>
            )}
          </>
        )}
        {tableItem.status === "closed" && <div>{tableItem.value}</div>}
      </Rect>
    </Root>
  );
});
