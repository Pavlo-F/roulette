import { memo, useContext, useMemo } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ButtonPlayPause } from "./ButtonPlayPause";
import { TimerAtomsCtx } from "./AtomsCtx";
import { useAtomValue } from "jotai";
import { ButtonReset } from "./ButtonReset";
dayjs.extend(duration);

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 20rem;
  padding-left: 0.5rem;
  flex: auto;
`;

const Time = styled.div`
  font-size: 3rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Form = memo(() => {
  const { totalMillisecondsAtom, elepsatedAtom } = useContext(TimerAtomsCtx);
  
  const totalMilliseconds = useAtomValue(totalMillisecondsAtom);
  const elepsated = useAtomValue(elepsatedAtom);
  
  const time = useMemo(() => {
    return dayjs.duration(totalMilliseconds - elepsated).format("HH:mm:ss");
  }, [elepsated, totalMilliseconds]);

  return (
    <Root>
      <Time>{time}</Time>

      <Actions>
        <ButtonPlayPause />
        <ButtonReset />
      </Actions>
    </Root>
  );
});
