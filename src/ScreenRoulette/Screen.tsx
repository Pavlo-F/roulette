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
import { ButtonSpin } from "./ButtonSpin";
import { FieldSpeedStop } from "./FieldSpeedStop";

const Root = styled.div`
  position: relative;
  display: flex;
  flex: auto;
  overflow: hidden;
`;

const Settings = styled.div`
  position: relative;
`;

const Row = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
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
        userName: x.userName,
      };
    });

    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* update by render only  */]);

  return (
    <RouletteAtomsProvider wheelData={data}>
      <Root>
        <BackAnimations />
        <Roulette />
        <Settings>
          <SwitchMode />
          <FieldSpeedStop />
          <FieldSpeed />

          <Row>
            <ButtonSpin />
            <ButtonShuffleLots />
          </Row>
        </Settings>
      </Root>
    </RouletteAtomsProvider>
  );
});
