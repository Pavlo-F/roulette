import React, { memo } from "react";
import styled from "styled-components";
import { Commands } from "./AtomsCtx";
import { FieldDegrees } from "./FieldDegrees";
import { FieldEnabled } from "./FieldEnabled";
import { FieldScale } from "./FieldScale";
import { FieldSeconds } from "./FieldSeconds";
import { withValidationProvider } from "../forms/Validation";

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
    return (
      <Root>
        <Header>Интерактив</Header>

        <Description>
          Позволяет влиять на интерфейс, по средствам донатов и комментария.
          <br />
          Например, чтобы повернуть экран надо задонатить любую сумму и написать комментарий
          &quot;Привет, хочу повернуть экран&quot;.
          <br />
          Место команды не имеет значения главное чтобы она буква в букву совпадала с командами
          ниже:
        </Description>

        <FlexCnt>
          <Row>
            <Name>{Commands.RotateRoot}:</Name>
            <FieldDegrees />
            <FieldSeconds field="rotateRoot" />
            <FieldEnabled field="rotateRoot" />
          </Row>

          <Row>
            <Name>
              {Commands.ChangeBackground}:<SubText>зависит от имени донатера</SubText>
            </Name>
            <FieldSeconds field="backgroundRoot" />
            <FieldEnabled field="backgroundRoot" />
          </Row>

          <Row>
            <Name>{Commands.BadEyes}:</Name>
            <FieldSeconds field="badEyes" />
            <FieldEnabled field="badEyes" />
          </Row>

          <Row>
            <Name>{Commands.InvertColor}:</Name>
            <FieldSeconds field="invertColor" />
            <FieldEnabled field="invertColor" />
          </Row>

          <Row>
            <Name>{Commands.ChangeCursor}:</Name>
            <FieldSeconds field="cursor" />
            <FieldEnabled field="cursor" />
          </Row>

          <Row>
            <Name>{Commands.Scale}:</Name>
            <FieldScale />
            <FieldSeconds field="scale" />
            <FieldEnabled field="scale" />
          </Row>

          <Row>
            <Name>{Commands.RotateColors}:</Name>
            <FieldSeconds field="rotateColors" />
            <FieldEnabled field="rotateColors" />
          </Row>
        </FlexCnt>
      </Root>
    );
  })
);
