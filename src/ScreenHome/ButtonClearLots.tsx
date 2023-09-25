import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { HomeAtomsCtx } from "./AtomsCtx";

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
  const { lotsAtom, participantsAtom } = useContext(HomeAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);
  const setParticipants = useSetAtom(participantsAtom);

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (confirm) {
      clearTimeout(timer);

      timer = window.setTimeout(() => {
        setConfirm(false);
      }, 5000);
    }
  }, [confirm]);

  const onClick = useCallback(() => {
    setConfirm(true);
  }, []);

  const onClickConfirm = useCallback(() => {
    setLots([]);
    setParticipants([]);

    setConfirm(false);
    clearTimeout(timer);
  }, [setLots, setParticipants]);

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
