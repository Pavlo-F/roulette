import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled, { css } from "styled-components";
import { MinesweeperAtomsCtx, TableItem, minesweeperSize } from "./AtomsCtx";
import { Item } from "./Item";
import { Process } from "./Process";
import { WinMessage } from "./WinMessage";
import { Games, SettingsAtomsCtx } from "../../../ScreenSettings/AtomsCtx";

const Root = styled.div`
  position: relative;
  color: var(--borderColor);
  display: flex;
  flex-direction: column;
`;

const Minesweeper = styled.div<{ $rows: number; $columns: number }>`
  position: relative;
  display: grid;

  ${props => css`
    grid-template-columns: repeat(${props.$columns}, 1fr);
    grid-template-rows: repeat(${props.$rows}, 1fr);
  `};

  flex: auto;
  z-index: 10;
  height: 20rem;
`;

export const Form = memo(() => {
  const { minesweeperAtom, timeLeftAtom } = useContext(MinesweeperAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const settings = useAtomValue(settingsAtom);
  const minesweeper = useAtomValue(minesweeperAtom);
  const timeLeft = useAtomValue(timeLeftAtom);

  const list = useMemo(() => {
    const result: TableItem[] = [];
    for (let i = 0; i < minesweeperSize.rows; i += 1)
      for (let j = 0; j < minesweeperSize.columns; j += 1) {
        result.push(minesweeper[i][j]);
      }

    return result;
  }, [minesweeper]);

  const integratedChat = useMemo(() => {
    const result = [];
    if (settings.integration.trovoChannel) {
      result.push("Trovo");
    }

    if (settings.integration.twichChannel) {
      result.push("Twitch");
    }

    return result;
  }, [settings.integration.trovoChannel, settings.integration.twichChannel]);

  if (
    (settings.integration && !integratedChat.length) ||
    settings.integration.game !== Games.Minesweeper
  ) {
    return null;
  }

  return (
    <Root>
      <div>Сапёр для {integratedChat.join(", ")}</div>
      <span>Напиши в чат цифру и она откроется через {timeLeft} секунд</span>

      <Process />
      <WinMessage />

      <Minesweeper $rows={minesweeperSize.rows} $columns={minesweeperSize.columns}>
        {list?.map(x => {
          return <Item key={`Item_${x.column}_${x.row}`} tableItem={x} />;
        })}
      </Minesweeper>
    </Root>
  );
});
