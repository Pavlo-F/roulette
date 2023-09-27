import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { HomeAtomsCtx } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";

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
  const { donateListAtom } = useContext(DonateAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);
  const setDonateList = useSetAtom(donateListAtom);

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
    setDonateList([]);

    setConfirm(false);
    clearTimeout(timer);
  }, [setLots, setDonateList]);

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
