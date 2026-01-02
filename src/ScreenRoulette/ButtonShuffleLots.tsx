import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { RouletteAtomsCtx } from "./AtomsCtx";
import { shuffleArray } from "../Utils/common";

export const ButtonShuffleLots = memo(() => {
  const { wheelDataAtom } = useContext(RouletteAtomsCtx);
  const setWheelData = useSetAtom(wheelDataAtom);

  const onClick = useCallback(() => {
    setWheelData(old => {
      return shuffleArray(old);
    });
  }, [setWheelData]);

  return <ButtonPrimary onClick={onClick}>Перемешать</ButtonPrimary>;
});
