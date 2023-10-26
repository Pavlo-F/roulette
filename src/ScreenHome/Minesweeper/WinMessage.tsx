import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { produce } from "immer";
import { useAtom } from "jotai";
import styled from "styled-components";
import { MinesweeperAtomsCtx, getDefault, minesweeperSize } from "./AtomsCtx";

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 11;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 50%;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const FlexCnt = styled.div`
  display: flex;
  flex: auto;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--secondaryColor500);
  padding: 1rem;
`;

let timeout = 0;

export const WinMessage = memo(() => {
  const { minesweeperAtom } = useContext(MinesweeperAtomsCtx);
  const [minesweeper, setMinesweeper] = useAtom(minesweeperAtom);
  const [isWin, setIsWin] = useState<boolean | undefined>(undefined);

  const onClose = useCallback(() => {
    setMinesweeper(getDefault());
    setIsWin(undefined);
    clearTimeout(timeout);
  }, [setMinesweeper]);

  useEffect(() => {
    let closed = 0;

    for (let i = 0; i < minesweeperSize.rows; i += 1) {
      for (let j = 0; j < minesweeperSize.columns; j += 1) {
        if (minesweeper[i][j].status === "opened" && minesweeper[i][j].isMine) {
          setIsWin(false);
          closed = 999;
          break;
        }

        if (minesweeper[i][j].status === "closed" && !minesweeper[i][j].isMine) {
          closed += 1;
        }
      }
    }

    if (!closed) {
      setIsWin(true);
    }

  }, [minesweeper]);

  useEffect(() => {
    if (isWin !== undefined) {
      setMinesweeper(
        produce(draft => {
          for (let i = 0; i < minesweeperSize.rows; i += 1) {
            for (let j = 0; j < minesweeperSize.columns; j += 1) {
              draft[i][j].status = "opened";
            }
          }
          return draft;
        })
      );

      timeout = window.setTimeout(() => {
        onClose();
      }, 10000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isWin, onClose, setMinesweeper]);

  if (isWin === undefined) {
    return null;
  }

  return (
    <Root onClick={onClose}>
      <Message>
        <FlexCnt>
          {isWin && <div>Чатик, Вы лучшие игроки в Сапёра!</div>}
          {isWin === false && <div>Чатик, не быть тебе сапёром</div>}
        </FlexCnt>
      </Message>
    </Root>
  );
});
