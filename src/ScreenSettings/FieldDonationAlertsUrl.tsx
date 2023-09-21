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
import ButtonPrimary from "../components/ButtonPrimary";
import { Error } from "../components/Error";
import { Input } from "../components/Input";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { Hint } from "./styles.styled";
import { ValidationContext } from "../forms/Validation";

const InputSt = styled(Input)`
  width: 25rem;
`;

const ButtonPrimarySt = styled(ButtonPrimary)`
  width: 27rem;
  height: 44px;
`;

const Warning = styled.div`
  font-size: 0.8em;
  color: var(--secondaryColor500);
`;

const ShowButtonCnt = styled.div`
  line-height: normal;
`;

export const FieldDonationAlertsUrl = memo(() => {
  const [error, setError] = useState("");
  const [isHidden, setIsHidden] = useState<boolean>(true);

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

    setValidateResults(
      produce(draft => {
        draft.DonationAlertsUrl = !!msg;
      })
    );

    return () => {
      setValidateResults(
        produce(draft => {
          delete draft.DonationAlertsUrl;
        })
      );
    };
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

  const onShowFieldClick = useCallback(() => {
    setIsHidden(false);
  }, []);

  return (
    <div>
      {!isHidden && (
        <InputSt
          value={url}
          placeholder="Вставьте ссылку на виджет https://www.donationalerts.com/widget/alerts..."
          onChange={onChange}
          className={error ? "invalid" : ""}
        />
      )}
      {isHidden && (
        <ButtonPrimarySt onClick={onShowFieldClick}>
          <ShowButtonCnt>
            <div>Показать поле</div>
            <Warning>не открывайте на трансляции</Warning>
          </ShowButtonCnt>
        </ButtonPrimarySt>
      )}
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
