import React, { memo, useCallback, useContext, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx, TableItem } from "./AtomsCtx";
import { useMove } from "./useMove";

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

const Vote = styled.div`
  position: absolute;
  top: 0rem;
  left: 0.5rem;
  font-size: 1rem;
`;

type Props = {
  tableItem: TableItem;
};

export const Item = memo(({ tableItem }: Props) => {
  const { fifteenAtom, voteMapAtom } = useContext(FifteenAtomsCtx);
  const setFifteen = useSetAtom(fifteenAtom);

  const voteMap = useAtomValue(voteMapAtom);

  const { move } = useMove();

  const vote = useMemo(() => {
    return voteMap[tableItem.value] || "";
  }, [tableItem.value, voteMap]);

  const onClick = useCallback(() => {
    const result = move(tableItem);
    if (result) {
      setFifteen(result);
    }
  }, [move, setFifteen, tableItem]);

  return (
    <Root onClick={onClick}>
      <Rect $isFree={tableItem.isFree}>
        <Vote title="Проголосовало">{vote}</Vote>
        {!tableItem.isFree && <div>{tableItem.value}</div>}
        </Rect>
    </Root>
  );
});
