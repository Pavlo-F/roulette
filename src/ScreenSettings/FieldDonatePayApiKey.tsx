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
import { Hint, Link } from "./styles.styled";
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

export const FieldDonatePayApiKey = memo(() => {
  const [error, setError] = useState("");
  const [isHidden, setIsHidden] = useState<boolean>(true);

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

    setValidateResults(
      produce(draft => {
        draft.DonatePayUrl = !!msg;
      })
    );

    return () => {
      setValidateResults(
        produce(draft => {
          delete draft.DonatePayUrl;
        })
      );
    };
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

  const onShowFieldClick = useCallback(() => {
    setIsHidden(false);
  }, []);

  return (
    <div>
      {!isHidden && (
        <InputSt
          value={apiKey}
          placeholder="Вставьте api ключ"
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
        <span>Ссылка на ключ находится по адресу: </span>
        <Link href="https://donatepay.ru/page/api" target="_blank" rel="noreferrer">
          https://donatepay.ru/page/api
        </Link>
      </Hint>
    </div>
  );
});
