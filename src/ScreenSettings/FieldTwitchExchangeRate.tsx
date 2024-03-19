import React, {
  ChangeEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useContext,
} from "react";
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
  width: 4rem;
`;

export const FieldTwitchExchangeRate = memo(() => {
  const { settingsTempAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsTempAtom);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!newValue) {
        setSettings(draft => {
          draft.integration.twitchExchangeRate = 1;
          return draft;
        });

        return;
      }

      setSettings(draft => {
        draft.integration.twitchExchangeRate = Number.parseInt(newValue, 10);
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
        maxLength={9}
        value={settings.integration.twitchExchangeRate || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <span> баллам</span>
    </Root>
  );
});
