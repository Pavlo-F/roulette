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
import { Hint } from "./styles.styled";

const InputSt = styled(Input)`
  width: 10rem;
`;

export const FieldDonationAlertsUrl = memo(() => {
  const [error, setError] = useState("");

  const { setValidateResults } = useContext(ValidationContext);
  const { settingsTempAtom } = useContext(SettingsAtomsCtx);
  const [settings, setSettings] = useAtom(settingsTempAtom);

  const url = useMemo(() => {
    return settings.integration?.donationAlertsWidgetUrl;
  }, [settings.integration?.donationAlertsWidgetUrl]);

  useEffect(() => {
    let msg = "";
    
    if (!url) {
      msg = "";
    } else if (url.indexOf("https://www.donationalerts.com/widget/alerts") < 0) {
      msg = "Неправильная ссылка";
    }

    setError(msg);

    setValidateResults(produce(draft => {
      draft.DonationAlertsUrl = !!msg;
    }));

    return (() => {
      setValidateResults(produce(draft => {
        delete draft.DonationAlertsUrl;
      }));
    });
  }, [setValidateResults, url]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setSettings(draft => {
        draft.integration.donationAlertsWidgetUrl = newValue;
        return draft;
      });
    },
    [setSettings]
  );

  return (
    <div>
      <InputSt
        value={url}
        placeholder="Вставьте ссылку на виджет https://www.donationalerts.com/widget/alerts..."
        onChange={onChange}
        className={error ? "invalid" : ""}
      />
      {error && <Error>{error}</Error>}
      <Hint>
        <span>Ссылка на виджет находится по адресу: </span>
        <a
          href="https://www.donationalerts.com/dashboard/widgets/alerts"
          target="_blank"
          rel="noreferrer">
          https://www.donationalerts.com/dashboard/widgets/alerts
        </a>
      </Hint>
    </div>
  );
});
