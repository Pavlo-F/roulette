import React, { ChangeEvent, KeyboardEvent, memo, useCallback } from "react";
import styled from "styled-components";
import { Input } from "../components/Input";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputSt = styled(Input)`
  width: 2rem;
`;

type Props = {
  setValue: (value: number | undefined) => void;
  value?: number;
};

export const FieldSeconds = memo(({ setValue, value }: Props) => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setValue(undefined);

        return;
      }

      setValue(Number.parseInt(newValue, 10));
    },
    [setValue]
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
      <div>на</div>

      <InputSt
        maxLength={3}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      <div>секунд</div>
    </Root>
  );
});
