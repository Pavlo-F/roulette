import React, { ChangeEvent, KeyboardEvent, memo, useCallback, useContext } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { Input } from "../components/Input";
import { RouletteAtomsCtx } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const InputSt = styled(Input)`
  width: 4rem;
`;

const min = 1;
const max = 100;

export const FieldSpeedStop = memo(() => {
  const { speedStopAtom } = useContext(RouletteAtomsCtx);
  const [speed, setSpeed] = useAtom(speedStopAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setSpeed(min);
        return;
      }

      const parced = Number.parseInt(newValue, 10);
      if (!parced) {
        setSpeed(min);
        return;
      }

      if (parced > max) {
        setSpeed(max);
        return;
      }

      setSpeed(parced);
    },
    [setSpeed]
  );

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (
      Number.isNaN(Number.parseInt(e.key, 10)) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  }, []);

  return (
    <Root>
      Скорость остановки
      <InputSt
        type="number"
        min={min}
        max={max}
        maxLength={3}
        value={speed}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      %
    </Root>
  );
});
