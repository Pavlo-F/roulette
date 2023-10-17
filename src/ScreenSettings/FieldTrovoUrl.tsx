import React, {
  ChangeEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { produce } from "immer";
import { useAtom } from "jotai";
import styled from "styled-components";
import { Error } from "../components/Error";
import { Input } from "../components/Input";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { ValidationContext } from "../forms/Validation";

const InputSt = styled(Input)`
  width: 25rem;
`;

export const FieldTrovoUrl = memo(() => {
  const [error, setError] = useState("");

  const { setValidateResults } = useContext(ValidationContext);
  const { settingsTempAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsTempAtom);

  const url = useMemo(() => {
    return settings.integration?.trovoChannel;
  }, [settings.integration?.trovoChannel]);

  useEffect(() => {
    let msg = "";

    if (!url) {
      msg = "";
    } else if (url.indexOf("https://trovo.live/s/") < 0) {
      msg = "Неправильная ссылка";
    }

    setError(msg);

    setValidateResults(
      produce(draft => {
        draft.trovoChannel = !!msg;
      })
    );

    return () => {
      setValidateResults(
        produce(draft => {
          delete draft.trovoChannel;
        })
      );
    };
  }, [setValidateResults, url]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setSettings(draft => {
        draft.integration.trovoChannel = newValue;
        return draft;
      });
    },
    [setSettings]
  );

  return (
    <div>
        <InputSt
          value={url}
          placeholder="Вставьте ссылку на Trovo канал https://trovo.live/s/..."
          onChange={onChange}
          className={error ? "invalid" : ""}
        />
      {error && <Error>{error}</Error>}

    </div>
  );
});
