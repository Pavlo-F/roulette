import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { HomeAtomsCtx } from "./AtomsCtx";

export const ButtonShowDonates = memo(() => {
  const { donatesVisibleAtom } = useContext(HomeAtomsCtx);
  const setDonatesVisible = useSetAtom(donatesVisibleAtom);

  const onClick = useCallback(() => {
    setDonatesVisible(true);
  }, [setDonatesVisible]);

  return <ButtonPrimary onClick={onClick}>Донаты</ButtonPrimary>;
});
