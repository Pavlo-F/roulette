import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { RouletteAtomsProvider } from "./AtomsCtx";
import { Roulette } from "./Roulette";
import { WheelData } from "./Roulette/models";
import { SwitchMode } from "./SwitchMode";
import { HomeAtomsCtx } from "../ScreenHome";
import { ButtonShuffleLots } from "./ButtonShuffleLots";
import { BackAnimations } from "./BackAnimations";
import { useTotalAmount } from "../ScreenHome/LotTable/useTotalAmount";
import { FieldSpeed } from "./FieldSpeed";

const Root = styled.div`
  position: relative;
  display: flex;
  flex: auto;
  overflow: hidden;
`;

const Settings = styled.div`
  position: relative;
`;

export const Screen = memo(() => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const lots = useAtomValue(lotsAtom);
  const totalAmount = useTotalAmount();

  const data: WheelData[] = useMemo(() => {
    const result = lots.map(x => {
      const sum = x.sum || 0;
      return {
        id: x.id,
        name: x.name,
        value: sum,
        percent: sum / totalAmount,
      };
    });

    return result;
  }, [lots, totalAmount]);

  return (
    <RouletteAtomsProvider wheelData={data}>
      <Root>
        <BackAnimations />
        <Roulette />
        <Settings>
          <SwitchMode />
          <ButtonShuffleLots />
          <FieldSpeed />
        </Settings>
      </Root>
    </RouletteAtomsProvider>
  );
});
