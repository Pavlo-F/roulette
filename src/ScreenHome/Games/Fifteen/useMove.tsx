import React, { useCallback, useContext } from "react";
import { useAtomValue } from "jotai";
import { FifteenAtomsCtx, TableData, TableItem, fifteenSize } from "./AtomsCtx";

export const useMove = () => {
  const { fifteenAtom } = useContext(FifteenAtomsCtx);
  const fifteen = useAtomValue(fifteenAtom);

  const move = useCallback(
    (tableItem: TableItem): TableData | null => {
      const data = JSON.parse(JSON.stringify(fifteen.data)) as TableItem[];

      const top = data[(tableItem.row - 1) * fifteenSize + tableItem.column];
      const right = tableItem.column + 1 > 3 ? undefined : data[tableItem.row * fifteenSize + tableItem.column + 1];
      const bottom = data[(tableItem.row + 1) * fifteenSize + tableItem.column];
      const left = tableItem.column - 1 < 0 ? undefined : data[tableItem.row * fifteenSize + tableItem.column - 1];

      const free = [top, right, bottom, left].find(x => !!x && x.isFree);

      if (!free) {
        return null;
      }

      const freeIndex = free.row * fifteenSize + free.column;
      const currentIndex = tableItem.row * fifteenSize + tableItem.column;

      const tmpValue = data[freeIndex].value;
      data[freeIndex].value = data[currentIndex].value;
      data[currentIndex].value = tmpValue;

      const tmpIsFree = data[freeIndex].isFree;
      data[freeIndex].isFree = data[currentIndex].isFree;
      data[currentIndex].isFree = tmpIsFree;

      return { data };
    },
    [fifteen.data]
  );

  return {
    move,
  };
};
