import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { RouletteAtomsCtx } from "./AtomsCtx";

export const ButtonSpin = memo(() => {
  const { spinWheelAtom, removeMessageAtom } = useContext(RouletteAtomsCtx);
  const handleSpinWheel = useSetAtom(spinWheelAtom);
  const setRemoveMessage = useSetAtom(removeMessageAtom);

  const onClick = useCallback(() => {
    setRemoveMessage(undefined);
    handleSpinWheel(prev => prev + 1);
  }, [handleSpinWheel, setRemoveMessage]);

  return <ButtonPrimary onClick={onClick}>Крутить</ButtonPrimary>;
});
