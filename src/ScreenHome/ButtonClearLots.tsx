import { memo, useCallback, useContext, useEffect, useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";
import { HomeAtomsCtx } from "./AtomsCtx";
import { useAtom } from "jotai";
import styled from "styled-components";

const Root = styled.div`
  margin-right: 1rem;
  margin-left: auto;
`;

const ButtonConfirm = styled(ButtonPrimary)`
  background-color: var(--invalid) !important;
  border: none;
`;

let timer = 0;

export const ButtonClearLots = memo(() => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (confirm) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        setConfirm(false);
      }, 5000);
    }
  }, [confirm]);

  const onClick = useCallback(() => {
    setConfirm(true);
  }, []);

  const onClickConfirm = useCallback(() => {
    setLots([]);

    setConfirm(false);
    clearTimeout(timer);
  }, [setLots]);

  if (confirm) {
    return (
      <Root>
        <ButtonConfirm onClick={onClickConfirm}>
          Подтвердить очистку
        </ButtonConfirm>
      </Root>
    );
  }

  return (
    <Root>
      <ButtonPrimary disabled={!lots.length} onClick={onClick}>
        Очистить таблицу
      </ButtonPrimary>
    </Root>
  );
});
