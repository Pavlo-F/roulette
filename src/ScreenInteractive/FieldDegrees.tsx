import React, { ChangeEvent, KeyboardEvent, memo, useCallback, useContext } from "react";
import { useImmerAtom } from "jotai-immer";
import styled from "styled-components";
import { Input } from "../components/Input";
import { InteractiveSettingsAtomsCtx } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputSt = styled(Input)`
  width: 2rem;
`;

export const FieldDegrees = memo(() => {
  const { interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const [settings, setSettings] = useImmerAtom(interactiveSettingsAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setSettings(draft => {
          draft.rotateRoot.degrees = undefined;
        });

        return;
      }

      setSettings(draft => {
        draft.rotateRoot.degrees = Number.parseInt(newValue, 10);
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
      e.key !== "ArrowRight" &&
      e.key !== "-"
    ) {
      e.preventDefault();
    }
  }, []);

  return (
    <Root>
      <div>на</div>

      <InputSt
        maxLength={3}
        value={settings.rotateRoot.degrees || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      <div>градусов</div>
    </Root>
  );
});
