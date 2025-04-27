import React, { memo, useCallback, useContext } from "react";
import { useImmerAtom } from "jotai-immer";
import styled from "styled-components";
import { Commands, InteractiveSettingsAtomsCtx } from "./AtomsCtx";
import { FieldDegrees } from "./FieldDegrees";
import { FieldEnabled } from "./FieldEnabled";
import { FieldSeconds } from "./FieldSeconds";
import { withValidationProvider } from "../forms/Validation";
import { FieldScale } from "./FieldScale";

const Root = styled.div``;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
`;

const Header = styled.div`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Name = styled.div`
  width: 10rem;
`;

const FlexCnt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubText = styled.div`
  font-size: 12px;
`;

const Description = styled.div`
  font-size: 14px;
  margin-bottom: 1rem;
`;

export const Screen = withValidationProvider(
  memo(() => {
    const { interactiveSettingsAtom } = useContext(InteractiveSettingsAtomsCtx);

    const [settings, setSettings] = useImmerAtom(interactiveSettingsAtom);

    const setRotateSeconds = useCallback(
      (value: number | undefined) => {
        setSettings(draft => {
          draft.rotateRoot.time = value;
        });
      },
      [setSettings]
    );

    const setRotateEnabled = useCallback(
      (value: boolean) => {
        setSettings(draft => {
          draft.rotateRoot.enabled = value;
        });
      },
      [setSettings]
    );

    const setBackgroundSeconds = useCallback(
      (value: number | undefined) => {
        setSettings(draft => {
          draft.backgroundRoot.time = value;
        });
      },
      [setSettings]
    );

    const setBackgroundEnabled = useCallback(
      (value: boolean) => {
        setSettings(draft => {
          draft.backgroundRoot.enabled = value;
        });
      },
      [setSettings]
    );

    const setBadEyesSeconds = useCallback(
      (value: number | undefined) => {
        setSettings(draft => {
          draft.badEyes.time = value;
        });
      },
      [setSettings]
    );

    const setBadEyesEnabled = useCallback(
      (value: boolean) => {
        setSettings(draft => {
          draft.badEyes.enabled = value;
        });
      },
      [setSettings]
    );

    const setInvertColorsSeconds = useCallback(
      (value: number | undefined) => {
        setSettings(draft => {
          draft.invertColor.time = value;
        });
      },
      [setSettings]
    );

    const setInvertColorsEnabled = useCallback(
      (value: boolean) => {
        setSettings(draft => {
          draft.invertColor.enabled = value;
        });
      },
      [setSettings]
    );

    const setCursorSeconds = useCallback(
      (value: number | undefined) => {
        setSettings(draft => {
          draft.cursor.time = value;
        });
      },
      [setSettings]
    );

    const setCursorEnabled = useCallback(
      (value: boolean) => {
        setSettings(draft => {
          draft.cursor.enabled = value;
        });
      },
      [setSettings]
    );

    const setScaleSeconds = useCallback(
      (value: number | undefined) => {
        setSettings(draft => {
          draft.scale.time = value;
        });
      },
      [setSettings]
    );

    const setScaleEnabled = useCallback(
      (value: boolean) => {
        setSettings(draft => {
          draft.scale.enabled = value;
        });
      },
      [setSettings]
    );

    return (
      <Root>
        <Header>Интерактив</Header>

        <Description>Позволяет влиять на интерфейс, по средствам донатов и комментария.<br />
          Например, чтобы повернуть экран надо задонатить любую сумму и написать комментарий &quot;Привет, хочу повернуть экран&quot;.<br />
          Место команды не имеет значения главное чтобы она буква в букву совпадала с командами ниже:
        </Description>

        <FlexCnt>
          <Row>
            <Name>{Commands.RotateRoot}:</Name>
            <FieldDegrees />
            <FieldSeconds setValue={setRotateSeconds} value={settings.rotateRoot?.time} />
            <FieldEnabled setValue={setRotateEnabled} checked={settings.rotateRoot?.enabled} />
          </Row>

          <Row>
            <Name>
              {Commands.ChangeBackground}:<SubText>зависит от имени донатера</SubText>
            </Name>
            <FieldSeconds setValue={setBackgroundSeconds} value={settings.backgroundRoot?.time} />
            <FieldEnabled
              setValue={setBackgroundEnabled}
              checked={settings.backgroundRoot?.enabled}
            />
          </Row>

          <Row>
            <Name>{Commands.BadEyes}:</Name>
            <FieldSeconds setValue={setBadEyesSeconds} value={settings.badEyes?.time} />
            <FieldEnabled setValue={setBadEyesEnabled} checked={settings.badEyes?.enabled} />
          </Row>

          <Row>
            <Name>{Commands.InvertColor}:</Name>
            <FieldSeconds setValue={setInvertColorsSeconds} value={settings.invertColor?.time} />
            <FieldEnabled setValue={setInvertColorsEnabled} checked={settings.invertColor?.enabled} />
          </Row>

          <Row>
            <Name>{Commands.ChangeCursor}:</Name>
            <FieldSeconds setValue={setCursorSeconds} value={settings.cursor?.time} />
            <FieldEnabled setValue={setCursorEnabled} checked={settings.cursor?.enabled} />
          </Row>

          <Row>
            <Name>{Commands.Scale}:</Name>
            <FieldScale />
            <FieldSeconds setValue={setScaleSeconds} value={settings.scale?.time} />
            <FieldEnabled setValue={setScaleEnabled} checked={settings.scale?.enabled} />
          </Row>
        </FlexCnt>
      </Root>
    );
  })
);
