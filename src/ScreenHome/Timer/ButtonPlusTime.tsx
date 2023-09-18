import React, { memo, useCallback, useContext } from "react";
import styled from "styled-components";
import { TimerAtomsCtx } from "./AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import SvgAddTime from "./ic_clock-plus.svg";

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
`;

export const ButtonPlusTime = memo(() => {
  const { addTime } = useContext(TimerAtomsCtx);

  const onClick = useCallback(() => {
    addTime(1);
  }, [addTime]);

  return (
    <ButtonSvg title="Добавить" onClick={onClick}>
      <Icon>
        <SvgAddTime />
      </Icon>
    </ButtonSvg>
  );
});
