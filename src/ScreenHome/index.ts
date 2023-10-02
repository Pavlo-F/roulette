export { HomeAtomsCtx, HomeAtomsProvider } from "./AtomsCtx";
export { DonateProcess } from "./DonateProcess";
export { TimerAtomsCtx, TimerAtomsProvider } from "./Timer/AtomsCtx";

export const IMAGES = {
    PngDonatePay: new URL("./ic_dp.png", import.meta.url).href,
    PngDonationAlerts: new URL("./ic_da.png", import.meta.url).href,
  };