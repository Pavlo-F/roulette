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

const Root = styled.div`
  position: relative;
  display: flex;
  flex: auto;
  overflow: hidden;
`;

export const Screen = memo(() => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const lots = useAtomValue(lotsAtom);

  const data: WheelData[] = useMemo(() => {
    const result = lots.map(x => {
      return {
        id: x.id,
        name: x.name,
        value: x.sum || 0,
      };
    });

    return result;
  }, [lots]);

  return (
    <RouletteAtomsProvider wheelData={data}>
      <Root>
        <BackAnimations />
        <Roulette />
        <div>
          <SwitchMode />
          <ButtonShuffleLots />
        </div>
      </Root>
    </RouletteAtomsProvider>
  );
});
