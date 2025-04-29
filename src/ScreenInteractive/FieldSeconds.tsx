import React, { ChangeEvent, KeyboardEvent, memo, useCallback, useContext } from "react";
import { useImmerAtom } from "jotai-immer";
import styled from "styled-components";
import { Input } from "../components/Input";
import { InteractiveSettingsAtomsCtx, SettingsFields } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputSt = styled(Input)`
  width: 2rem;
`;

type Props = {
  field: SettingsFields;
};

export const FieldSeconds = memo(({ field }: Props) => {
  const { interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const [settings, setSettings] = useImmerAtom(interactiveSettingsAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      let result: number | undefined;

      if (newValue) {
        result = Number.parseInt(newValue, 10);
      }

      setSettings(draft => {
        draft[field].time = result;
      });
    },
    [field, setSettings]
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
      <div>на</div>

      <InputSt
        maxLength={3}
        value={settings[field].time || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      <div>секунд</div>
    </Root>
  );
});
