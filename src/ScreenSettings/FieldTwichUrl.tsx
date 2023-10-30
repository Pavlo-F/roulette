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

export const FieldTwichUrl = memo(() => {
  const [error, setError] = useState("");

  const { setValidateResults } = useContext(ValidationContext);
  const { settingsTempAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsTempAtom);

  const url = useMemo(() => {
    return settings.integration?.twichChannel;
  }, [settings.integration?.twichChannel]);

  useEffect(() => {
    let msg = "";

    if (!url) {
      msg = "";
    } else if (url.indexOf("https://www.twitch.tv/") < 0) {
      msg = "Неправильная ссылка";
    }

    setError(msg);

    setValidateResults(
      produce(draft => {
        draft.twichChannel = !!msg;
      })
    );

    return () => {
      setValidateResults(
        produce(draft => {
          delete draft.twichChannel;
        })
      );
    };
  }, [setValidateResults, url]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setSettings(draft => {
        draft.integration.twichChannel = newValue;
        return draft;
      });
    },
    [setSettings]
  );

  return (
    <div>
        <InputSt
          value={url}
          placeholder="Вставьте ссылку на Twich канал https://www.twitch.tv/..."
          onChange={onChange}
          className={error ? "invalid" : ""}
        />
      {error && <Error>{error}</Error>}

    </div>
  );
});
