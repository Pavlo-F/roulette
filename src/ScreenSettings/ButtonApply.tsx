import React, { memo, useCallback, useContext, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { ValidationContext } from "../forms/Validation";

export const ButtonApply = memo(() => {
  const { isInvalid } = useContext(ValidationContext);
  const { settingsTempAtom, settingsAtom } = useContext(SettingsAtomsCtx);

  const [settings, setSettings] = useAtom(settingsAtom);
  const settingsTemp = useAtomValue(settingsTempAtom);

  const isTouched = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(settingsTemp);
  }, [settings, settingsTemp]);

  const onClick = useCallback(() => {
    setSettings(settingsTemp);
  }, [setSettings, settingsTemp]);

  return (
    <ButtonPrimary onClick={onClick} disabled={isInvalid() || !isTouched}>
      Применить
    </ButtonPrimary>
  );
});
