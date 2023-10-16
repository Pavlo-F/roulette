import React, { memo, useCallback, useContext } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx, TableItem, fifteenSize } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
`;

const Rect = styled.div<{$isFree: boolean}>`
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
  const [fifteen, setFifteen] = useAtom(fifteenAtom);

  const onClick = useCallback(() => {
    const data = [...fifteen.data];

    const top = data[(tableItem.row - 1) * fifteenSize + tableItem.column];
    const right = data[tableItem.row * fifteenSize + tableItem.column + 1];
    const bottom = data[(tableItem.row + 1) * fifteenSize + tableItem.column];
    const left = data[tableItem.row * fifteenSize + tableItem.column - 1];

    const free = [top, right, bottom, left].find(x => !!x && x.isFree);

    if (!free) {
      return;
    }

    const freeIndex = free.row * fifteenSize + free.column;
    const currentIndex = tableItem.row * fifteenSize + tableItem.column;

    const tmpValue = data[freeIndex].value;
    data[freeIndex].value = data[currentIndex].value;
    data[currentIndex].value = tmpValue;

    const tmpIsFree = data[freeIndex].isFree;
    data[freeIndex].isFree = data[currentIndex].isFree;
    data[currentIndex].isFree = tmpIsFree;

    setFifteen({ data });
  }, []);

  return (
    <Root onClick={onClick}>
      <Rect $isFree={tableItem.isFree}>
        {!tableItem.isFree && <div>{tableItem.value}</div>}
      </Rect>
    </Root>
  );
});
