import React, { ChangeEvent, memo, useCallback } from "react";
import styled from "styled-components";
import { CheckBox } from "../components/CheckBox";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

type Props = {
  setValue: (checked: boolean) => void;
  checked: boolean;
};

export const FieldEnabled = memo(({ checked, setValue }: Props) => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.checked);
    },
    [setValue]
  );

  return (
    <Root>
      <CheckBox
        checked={checked}
        onChange={onChange}
      >
        включено
      </CheckBox>
    </Root>
  );
});
