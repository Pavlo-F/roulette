import React, { memo, useCallback, useContext } from "react";
import styled from "styled-components";
import { TimerAtomsCtx } from "./AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import SvgReset from "./ic_reset.svg";

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
`;

export const ButtonReset = memo(() => {
  const { reset } = useContext(TimerAtomsCtx);

  const onClick = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <ButtonSvg title="Сбросить" onClick={onClick}>
      <Icon>
        <SvgReset />
      </Icon>
    </ButtonSvg>
  );
});
