import React, {
  ChangeEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useContext,
} from "react";
import { produce } from "immer";
import { useAtom } from "jotai";
import styled from "styled-components";
import { Input } from "../components/Input";
import { SettingsAtomsCtx } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputSt = styled(Input)`
  width: 2rem;
`;

export const FieldDefaultTime = memo(() => {
  const { settingsTempAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsTempAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setSettings(draft => {
          draft.timer.defaultMinutes = 0;
          return draft;
        });

        return;
      }

      setSettings(draft => {
        draft.timer.defaultMinutes = Number.parseInt(newValue, 10);
        return draft;
      });
    },
    [setSettings]
  );

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (
      Number.isNaN(Number.parseInt(e.key, 10)) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  }, []);

  return (
    <Root>
      <InputSt
        maxLength={3}
        value={settings.timer.defaultMinutes}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      <div>минут</div>
    </Root>
  );
});
