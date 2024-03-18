import React, { useCallback, useContext } from "react";
import { produce } from "immer";
import { useAtom } from "jotai";
import { MinesweeperAtomsCtx, TableItem, minesweeperSize } from "./AtomsCtx";

export const useOpen = () => {
  const { minesweeperAtom } = useContext(MinesweeperAtomsCtx);
  const [minesweeper, setMinesweeper] = useAtom(minesweeperAtom);

  const getNeighbours = useCallback(
    (tableItem: TableItem) => {
      const prevRow = tableItem.row - 1;
      const nextRow = tableItem.row + 1;
      const prevColumn = tableItem.column - 1;
      const nextColumn = tableItem.column + 1;

      const isNextColumnOutOfRange = nextColumn > minesweeperSize.columns;
      const isNextRowOutOfRange = nextRow > minesweeperSize.rows;

      const top = prevRow < 0 ? undefined : minesweeper[prevRow]?.at(tableItem.column);
      const topRight = prevRow < 0 || isNextColumnOutOfRange ? undefined : minesweeper[prevRow]?.at(nextColumn);
      const right = isNextColumnOutOfRange ? undefined : minesweeper[tableItem.row]?.at(nextColumn);
      const rightBottom = isNextRowOutOfRange || isNextColumnOutOfRange ? undefined : minesweeper[nextRow]?.at(nextColumn);
      const bottom = isNextRowOutOfRange ? undefined : minesweeper[nextRow]?.at(tableItem.column);
      const leftBottom = prevColumn < 0 || isNextRowOutOfRange ? undefined : minesweeper[nextRow]?.at(prevColumn);
      const left = prevColumn < 0 ? undefined : minesweeper[tableItem.row]?.at(prevColumn);
      const topLeft = prevRow < 0 || prevColumn < 0 ? undefined : minesweeper[prevRow]?.at(prevColumn);

      return [top, topRight, right, rightBottom, bottom, leftBottom, left, topLeft];
    },
    [minesweeper]
  );

  const open = useCallback(
    (tableItem: TableItem) => {
      const neighbours = getNeighbours(tableItem);
      const mines = neighbours.filter(x => !!x && x.isMine).length;

      setMinesweeper(
        produce(draft => {
          if (!mines && !tableItem.isMine) {
            neighbours.forEach(x => {
              if (x) {
                draft[x.row][x.column].status = "opened";
              }
            });
          }

          draft[tableItem.row][tableItem.column].status = "opened";
          return draft;
        })
      );
    },
    [getNeighbours, setMinesweeper]
  );

  return {
    open,
    getNeighbours,
  };
};
