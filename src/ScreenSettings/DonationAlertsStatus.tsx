import React, { memo, useContext } from "react";
import { useAtomValue } from "jotai";
import { statusMap } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";

export const DonationAlertsStatus = memo(() => {
  const { donationAlertsStatusAtom } = useContext(DonateAtomsCtx);
  const donationAlertsStatus = useAtomValue(donationAlertsStatusAtom);

  return <div>{statusMap[donationAlertsStatus]}</div>;
});
