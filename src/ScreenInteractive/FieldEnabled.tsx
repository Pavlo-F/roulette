import React, { ChangeEvent, memo, useCallback, useContext } from "react";
import { useImmerAtom } from "jotai-immer";
import styled from "styled-components";
import { CheckBox } from "../components/CheckBox";
import { InteractiveSettingsAtomsCtx, SettingsFields } from "./AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

type Props = {
  field: SettingsFields;
};

export const FieldEnabled = memo(({ field }: Props) => {
  const { interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);
  const [settings, setSettings] = useImmerAtom(interactiveSettingsAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSettings(draft => {
        draft[field].enabled = e.target.checked;
      });
    },
    [field, setSettings]
  );

  return (
    <Root>
      <CheckBox checked={settings[field].enabled} onChange={onChange}>
        включено
      </CheckBox>
    </Root>
  );
});
