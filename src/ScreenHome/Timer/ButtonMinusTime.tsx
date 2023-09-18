import React, { memo, useCallback, useContext } from "react";
import styled from "styled-components";
import { TimerAtomsCtx } from "./AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import SvgMinusTime from "./ic_clock-minus.svg";

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
`;

export const ButtonMinusTime = memo(() => {
  const { addTime } = useContext(TimerAtomsCtx);

  const onClick = useCallback(() => {
    addTime(-1);
  }, [addTime]);

  return (
    <ButtonSvg title="Уменьшить" onClick={onClick}>
      <Icon>
        <SvgMinusTime />
      </Icon>
    </ButtonSvg>
  );
});
