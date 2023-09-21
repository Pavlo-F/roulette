import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import { DonatePayService } from "./DonatePayService";
import { DonatePaySocketTokens } from "./models";
import { SettingsAtomsCtx } from "../../ScreenSettings/AtomsCtx";
import { DonationAlertsService } from "./DonationAlertsService";

export const DonateService = memo(() => {
  const { settingsAtom } = useContext(SettingsAtomsCtx);
  const settings = useAtomValue(settingsAtom);

  const donatePayTokens: DonatePaySocketTokens | undefined = useMemo(() => {
    if (!settings) {
      return undefined;
    }

    if (!settings.integration.donateApiUserId || !settings.integration.donatePayApiKey) {
      return undefined;
    }

    return {
      token: settings.integration.donatePayApiKey,
      userId: settings.integration.donateApiUserId,
    } as DonatePaySocketTokens;
  }, [settings]);

  const donationAlertsToken: string = useMemo(() => {
    if (!settings) {
      return "";
    }

    if (!settings.integration.donationAlertsWidgetUrl) {
      return "";
    }

    const splited = settings.integration.donationAlertsWidgetUrl.split("&token=");
    const result = splited[splited.length - 1];

    return result;
  }, [settings]);

  return (
    <>
      {donatePayTokens && <DonatePayService accessToken={donatePayTokens.token} userId={donatePayTokens.userId} />}
      {donationAlertsToken && <DonationAlertsService accessToken={donationAlertsToken} />}
    </>
  );
});
