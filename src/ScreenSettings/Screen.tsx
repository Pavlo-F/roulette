import React, { memo, useContext, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { SettingsAtomsCtx } from "./AtomsCtx";
import { ButtonApply } from "./ButtonApply";
import { ButtonConnectToTwich } from "./ButtonConnectToTwich";
import { DonatePayStatus } from "./DonatePayStatus";
import { DonationAlertsStatus } from "./DonationAlertsStatus";
import { FieldAddTime } from "./FieldAddTime";
import { FieldAddTimeByDonate } from "./FieldAddTimeByDonate";
import { FieldAddTimeForNewPosition } from "./FieldAddTimeForNewPosition";
import { FieldDefaultTime } from "./FieldDefaultTime";
import { FieldDonatePayApiKey } from "./FieldDonatePayApiKey";
import { FieldDonationAlertsUrl } from "./FieldDonationAlertsUrl";
import { FieldThresholdToAddTime } from "./FieldThresholdToAddTime";
import { FieldTrovoUrl } from "./FieldTrovoUrl";
import { FieldTwichUrl } from "./FieldTwichUrl";
import { FieldTwitchExchangeRate } from "./FieldTwitchExchangeRate";
import { SwitchGame } from "./SwitchGame";
import { TrovoStatus } from "./TrovoStatus";
import { TwichStatus } from "./TwichStatus";
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

const Footer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 0.5rem 0;
  background-color: var(--primaryColor800);
`;

const Currency = styled.span`
  color: var(--secondaryColor500);
  font-weight: 600;
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
            <FlexCnt>
              <FieldAddTimeForNewPosition />
              <FlexCnt>
                <div>порог суммы</div>
                <FieldThresholdToAddTime />
              </FlexCnt>
            </FlexCnt>

            <div>Время прибавления при донате</div>
            <FieldAddTimeByDonate />
          </Grid>
        </Row>

        <Row>
          <Header>Интеграция с донатами</Header>

          <Grid>
            <FlexCnt>
              <DonationTitle>DonatePay</DonationTitle>
              <DonatePayStatus />
            </FlexCnt>
            <FieldDonatePayApiKey />

            <FlexCnt>
              <DonationTitle>DonationAlerts</DonationTitle>
              <DonationAlertsStatus />
            </FlexCnt>
            <FieldDonationAlertsUrl />

            <div>Курс к баллам Twitch. <Currency>1</Currency> рубль равен:</div>
            <FieldTwitchExchangeRate />
          </Grid>
        </Row>

        <Row>
          <Header>Интеграция с чатом</Header>

          <SwitchGame />

          <Grid>
            <FlexCnt>
              <DonationTitle>Trovo</DonationTitle>
              <TrovoStatus />
            </FlexCnt>
            <FlexCnt>
              <FieldTrovoUrl />
            </FlexCnt>

            <FlexCnt>
              <DonationTitle>Twitch</DonationTitle>
              <TwichStatus />
            </FlexCnt>
            <FlexCnt>
              <FieldTwichUrl />
              <ButtonConnectToTwich />
            </FlexCnt>
          </Grid>
        </Row>

        <Footer>
          <ButtonApply />
        </Footer>
      </Root>
    );
  })
);
