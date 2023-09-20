import React, { memo, useContext, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { ButtonApply } from "./ButtonApply";
import { DonatePayStatus } from "./DonatePayStatus";
import { FieldAddTime } from "./FieldAddTime";
import { FieldAddTimeForNewPosition } from "./FieldAddTimeForNewPosition";
import { FieldDefaultTime } from "./FieldDefaultTime";
import { FieldDonatePayApiKey } from "./FieldDonatePayApiKey";
import { FieldDonationAlertsUrl } from "./FieldDonationAlertsUrl";
import { FlexCnt } from "./styles.styled";
import { withValidationProvider } from "../forms/Validation";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 20rem auto;
  align-items: center;
  row-gap: 1rem;
`;

const DonationTitle = styled.div`
  width: 7rem;
`;

export const Screen = withValidationProvider(
  memo(() => {
    const { settingsTempAtom, settingsAtom } = useContext(SettingsAtomsCtx);

    const settings = useAtomValue(settingsAtom);
    const setSettingsTemp = useSetAtom(settingsTempAtom);

    useEffect(() => {
      setSettingsTemp(settings);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSettingsTemp]);

    return (
      <Root>
        <Row>
          <Header>Таймер</Header>

          <Grid>
            <div>Начальное время</div>
            <FieldDefaultTime />

            <div>Время ручного прибавления таймера</div>
            <FieldAddTime />

            <div>Время прибавления за новую позицию</div>
            <FieldAddTimeForNewPosition />
          </Grid>
        </Row>

        <Row>
          <Header>Интеграция</Header>

          <Grid>
            <FlexCnt>
              <DonationTitle>DonatePay</DonationTitle>
              <DonatePayStatus />
            </FlexCnt>

            <FieldDonatePayApiKey />

            <DonationTitle>DonationAlerts</DonationTitle>
            <FieldDonationAlertsUrl />
          </Grid>
        </Row>

        <ButtonApply />
      </Root>
    );
  })
);
