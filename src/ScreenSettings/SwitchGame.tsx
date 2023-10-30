import React, { ChangeEventHandler, memo, useCallback, useContext, useEffect } from "react";
import { produce } from "immer";
import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import { Radio } from "../components/Radio";
import { Games, SettingsAtomsCtx } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const SwitchGame = memo(() => {
  const { settingsTempAtom, settingsAtom } = useContext(SettingsAtomsCtx);

  const settings = useAtomValue(settingsAtom);
  const [settingsTemp, setSettingsTemp] = useAtom(settingsTempAtom);

  useEffect(() => {
    setSettingsTemp(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSettingsTemp]);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      const value = e.target.value as Games;

      setSettingsTemp(
        produce(draft => {
          draft.integration.game = value;
          return draft;
        })
      );
    },
    [setSettingsTemp]
  );

  return (
    <Root>
      <div>Игра для чата</div>
      <Radio
        name="game"
        value={Games.Fifteen}
        onChange={onChange}
        checked={settingsTemp.integration.game === Games.Fifteen}>
        Пятнашки
      </Radio>
      <Radio
        name="game"
        value={Games.Minesweeper}
        onChange={onChange}
        checked={settingsTemp.integration.game === Games.Minesweeper}>
        Сапёр
      </Radio>
    </Root>
  );
});
