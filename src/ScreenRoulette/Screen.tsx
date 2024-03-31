import React, { memo } from "react";
import styled from "styled-components";
import { BackAnimations } from "./BackAnimations";
import { ButtonShuffleLots } from "./ButtonShuffleLots";
import { FieldSpeed } from "./FieldSpeed";
import { Roulette } from "./Roulette";
import { SwitchMode } from "./SwitchMode";

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
  return (
    <Root>
      <BackAnimations />
      <Roulette />
      <Settings>
        <SwitchMode />
        <ButtonShuffleLots />
        <FieldSpeed />
      </Settings>
    </Root>
  );
});
