import { memo, useCallback, useContext } from "react";
import { TimerAtomsCtx } from "./AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import styled from "styled-components";
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
    <ButtonSvg onClick={onClick}>
      <Icon>
        <SvgReset />
      </Icon>
    </ButtonSvg>
  );
});
