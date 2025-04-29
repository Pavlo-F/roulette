import React, { memo, useContext } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { useChangeBackground, useRotateRoot, useScale } from "../ScreenInteractive";
import { Commands, InteractiveSettingsAtomsCtx } from "../ScreenInteractive/AtomsCtx";
import { useChangeCursor } from "../ScreenInteractive/useChangeCursor";
import { useColorFilter } from "../ScreenInteractive/useFilter";
import { useRotateColors } from "../ScreenInteractive/useRotateColors";
import { DonateAtomsCtx } from "../Services/DonateService";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 55px;
`;

const ButtonPrimarySt = styled(ButtonPrimary)`
  padding: 0;
  border: none;
  border-radius: 0;
  justify-content: start;
  height: 25px;
  outline: none;
  color: var(--secondaryColor500);

  &:focus:not(:active) {
    border: none;
  }
`;

export const InteractiveCommands = memo(() => {
  const { interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const interactiveSettings = useAtomValue(interactiveSettingsAtom);

  const { donateAtom } = useContext(DonateAtomsCtx);
  const donate = useAtomValue(donateAtom);

  const { ChangeBackground } = useChangeBackground(donate.name || new Date().toJSON());
  const { ExecuteRotate } = useRotateRoot();
  const { ColorFilter } = useColorFilter();
  const { ChangeCursor } = useChangeCursor();
  const { ExecuteScale } = useScale();
  const { ExecuteRotateColors } = useRotateColors();

  return (
    <Root>
      {interactiveSettings?.rotateRoot?.enabled && (
        <ButtonPrimarySt onClick={() => ExecuteRotate()}>{Commands.RotateRoot}</ButtonPrimarySt>
      )}
      {interactiveSettings?.backgroundRoot?.enabled && (
        <ButtonPrimarySt onClick={() => ChangeBackground()}>
          {Commands.ChangeBackground}
        </ButtonPrimarySt>
      )}
      {interactiveSettings?.badEyes?.enabled && (
        <ButtonPrimarySt onClick={() => ColorFilter("blur(3px)")}>
          {Commands.BadEyes}
        </ButtonPrimarySt>
      )}
      {interactiveSettings?.invertColor?.enabled && (
        <ButtonPrimarySt onClick={() => ColorFilter("invert()")}>
          {Commands.InvertColor}
        </ButtonPrimarySt>
      )}
      {interactiveSettings?.cursor?.enabled && (
        <ButtonPrimarySt onClick={() => ChangeCursor()}>{Commands.ChangeCursor}</ButtonPrimarySt>
      )}
      {interactiveSettings?.scale?.enabled && (
        <ButtonPrimarySt onClick={() => ExecuteScale()}>{Commands.Scale}</ButtonPrimarySt>
      )}
      {interactiveSettings?.rotateColors?.enabled && (
        <ButtonPrimarySt onClick={() => ExecuteRotateColors()}>
          {Commands.RotateColors}
        </ButtonPrimarySt>
      )}
    </Root>
  );
});
