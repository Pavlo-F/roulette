import React, { memo, useCallback, useContext } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { TimerAtomsCtx } from "./AtomsCtx";
import { ButtonSvg } from "../../components/ButtonSvg";
import SvgPlay from "./ic_play.svg";
import SvgPause from "./ic_pause.svg";

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
`;

export const ButtonPlayPause = memo(() => {
  const { isStartedAtom } = useContext(TimerAtomsCtx);
  const [isStarted, setIsStarted] = useAtom(isStartedAtom);

  const onClick = useCallback(() => {
    setIsStarted(old => !old);
  }, [setIsStarted]);

  return (
    <ButtonSvg onClick={onClick}>
      {isStarted ? (
        <Icon title="Приостановить">
          <SvgPause />
        </Icon>
      ) : (
        <Icon title="Запустить">
          <SvgPlay />
        </Icon>
      )}
    </ButtonSvg>
  );
});
