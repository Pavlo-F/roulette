import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx, TableItem } from "./AtomsCtx";
import { useMove } from "./useMove";

const Root = styled.div`
  display: flex;
`;

const Rect = styled.div<{ $isFree: boolean }>`
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

type Props = {
  tableItem: TableItem;
};

export const Item = memo(({ tableItem }: Props) => {
  const { fifteenAtom } = useContext(FifteenAtomsCtx);
  const setFifteen = useSetAtom(fifteenAtom);

  const { move } = useMove();

  const onClick = useCallback(() => {
    const result = move(tableItem);
    if (result) {
      setFifteen(result);
    }
  }, [move, setFifteen, tableItem]);

  return (
    <Root onClick={onClick}>
      <Rect $isFree={tableItem.isFree}>{!tableItem.isFree && <div>{tableItem.value}</div>}</Rect>
    </Root>
  );
});
