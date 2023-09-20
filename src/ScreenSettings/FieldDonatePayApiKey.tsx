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
import axios from "axios";
import { Error } from "../components/Error";
import { Input } from "../components/Input";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { ValidationContext } from "../forms/Validation";
import { Hint } from "./styles.styled";

const InputSt = styled(Input)`
  width: 30rem;
`;

export const FieldDonatePayApiKey = memo(() => {
  const [error, setError] = useState("");

  const { setValidateResults } = useContext(ValidationContext);
  const { settingsTempAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsTempAtom);

  const apiKey = useMemo(() => {
    return settings.integration?.donatePayApiKey;
  }, [settings.integration?.donatePayApiKey]);

  useEffect(() => {
    let msg = "";

    if (!apiKey) {
      msg = "";
    } else if (apiKey.length < 60) {
      msg = "Неправильный ключ";
    }

    setError(msg);

    setValidateResults(produce(draft => {
      draft.DonatePayUrl = !!msg;
    }));

    return (() => {
      setValidateResults(produce(draft => {
        delete draft.DonatePayUrl;
      }));
    });
  }, [apiKey, setValidateResults]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setSettings(draft => {
        draft.integration.donatePayApiKey = newValue;
        return draft;
      });
    },
    [setSettings]
  );

  return (
    <div>
      <InputSt
        value={apiKey}
        placeholder="Вставьте ссылку на виджет api ключ"
        onChange={onChange}
        className={error ? "invalid" : ""}
      />
      {error && <Error>{error}</Error>}
      <Hint>
        <span>Ссылка на ключ находится по адресу: </span>
        <a
          href="https://donatepay.ru/page/api"
          target="_blank"
          rel="noreferrer">
          https://donatepay.ru/page/api
        </a>
      </Hint>
    </div>
  );
});
