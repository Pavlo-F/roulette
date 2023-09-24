import React, { memo } from "react";
import styled from "styled-components";
import { RouletteAtomsProvider } from "./AtomsCtx";
import { Roulette } from "./Roulette";
import { SwitchMode } from "./SwitchMode";

const Root = styled.div`
  display: flex;
  flex: auto;
`;

export const Screen = memo(() => {
  return (
    <RouletteAtomsProvider>
      <Root>
        <Roulette />
        <div>
          <SwitchMode />
        </div>
      </Root>
    </RouletteAtomsProvider>
  );
});
