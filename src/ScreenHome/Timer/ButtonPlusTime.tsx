import React, { memo, useCallback, useContext } from "react";
import styled from "styled-components";
import { useAtomValue } from "jotai";
import { TimerAtomsCtx } from "./AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import SvgAddTime from "./ic_clock-plus.svg";
import { SettingsAtomsCtx } from "../../ScreenSettings/AtomsCtx";

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
`;

export const ButtonPlusTime = memo(() => {
  const { addTime } = useContext(TimerAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);
  const settings = useAtomValue(settingsAtom);

  const onClick = useCallback(() => {
    addTime(settings.timer.addSeconds * 1000);
  }, [addTime, settings.timer.addSeconds]);

  return (
    <ButtonSvg title="Добавить" onClick={onClick}>
      <Icon>
        <SvgAddTime />
      </Icon>
    </ButtonSvg>
  );
});
