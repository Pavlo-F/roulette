import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { RouletteAtomsCtx } from "./AtomsCtx";
import { shuffleArray } from "../Utils/common";

const ButtonPrimarySt = styled(ButtonPrimary)`
  margin-top: 2rem;
`;

export const ButtonShuffleLots = memo(() => {
  const { wheelDataAtom } = useContext(RouletteAtomsCtx);
  const setWheelData = useSetAtom(wheelDataAtom);

  const onClick = useCallback(() => {
    setWheelData(old => {
      return shuffleArray(old);
    });
  }, [setWheelData]);

  return <ButtonPrimarySt onClick={onClick}>Перемешать</ButtonPrimarySt>;
});
