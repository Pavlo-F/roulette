import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { RouletteAtomsCtx } from "./AtomsCtx";
import { WheelData } from "./Roulette/models";

const ButtonPrimarySt = styled(ButtonPrimary)`
  margin-top: 2rem;
`;

export const ButtonShuffleLots = memo(() => {
  const { wheelDataAtom } = useContext(RouletteAtomsCtx);
  const setWheelData = useSetAtom(wheelDataAtom);

  const shuffleArray = useCallback((array: WheelData[]) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }, []);

  const onClick = useCallback(() => {
    setWheelData(old => {
      return shuffleArray(old);
    });
  }, [setWheelData, shuffleArray]);

  return <ButtonPrimarySt onClick={onClick}>Перемешать</ButtonPrimarySt>;
});
