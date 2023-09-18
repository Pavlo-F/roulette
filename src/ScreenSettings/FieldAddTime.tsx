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

export const FieldAddTime = memo(() => {
  const { settingsAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setSettings(
          produce(draft => {
            draft.timer.addSeconds = 0;
          })
        );

        return;
      }

      setSettings(
        produce(draft => {
          draft.timer.addSeconds = Number.parseInt(newValue, 10);
        })
      );
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
        value={settings.timer.addSeconds}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      <div>секунд</div>
    </Root>
  );
});
