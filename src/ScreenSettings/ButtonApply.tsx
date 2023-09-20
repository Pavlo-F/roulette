import React, { memo, useCallback, useContext } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { ValidationContext } from "../forms/Validation";

export const ButtonApply = memo(() => {
  const { isInvalid } = useContext(ValidationContext);
  const { settingsTempAtom, settingsAtom } = useContext(SettingsAtomsCtx);
  
  const setSettings = useSetAtom(settingsAtom);
  const settingsTemp = useAtomValue(settingsTempAtom);

  const onClick = useCallback(() => {
    setSettings(settingsTemp);
  }, [setSettings, settingsTemp]);

  return (
    <ButtonPrimary onClick={onClick} disabled={isInvalid()}>
      Применить
    </ButtonPrimary>
  );
});
