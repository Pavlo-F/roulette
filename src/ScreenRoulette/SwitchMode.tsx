import React, { memo, useCallback, useContext } from "react";
import { useAtom } from "jotai";
import styled, { css } from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { Mode, RouletteAtomsCtx } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  flex: auto;
`;

const ButtonPrimarySt = styled(ButtonPrimary)<{ selected: boolean }>`
  border-radius: 4px;

  ${props => {
    if (props.selected) {
      return css`
        background-color: var(--secondaryColor500);
        color: var(--primaryColor800);

        &:hover {
          background-color: var(--secondaryColor500) !important;
        }
      `;
    }

    return css`
      background-color: var(--primaryColor800);
      color: inherit;
    `;
  }};
`;

export const SwitchMode = memo(() => {
  const { modeAtom } = useContext(RouletteAtomsCtx);
  const [mode, setMode] = useAtom(modeAtom);

  const onClick = useCallback(
    (value: Mode) => {
      return () => {
        setMode(value);
      };
    },
    [setMode]
  );

  return (
    <Root>
      <ButtonPrimarySt selected={mode === Mode.Classic} onClick={onClick(Mode.Classic)}>
        Классика
      </ButtonPrimarySt>
      <ButtonPrimarySt selected={mode === Mode.Elimination} onClick={onClick(Mode.Elimination)}>
        Выбывание
      </ButtonPrimarySt>
    </Root>
  );
});
