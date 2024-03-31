import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { AppRouts } from "./AppRouts";
import { DonateProcess, HomeAtomsCtx, HomeAtomsProvider, TimerAtomsProvider } from "./ScreenHome";
import { FifteenAtomsProvider } from "./ScreenHome/Games/Fifteen";
import { MinesweeperAtomsProvider } from "./ScreenHome/Games/Minesweeper/AtomsCtx";
import { useTotalAmount } from "./ScreenHome/LotTable/useTotalAmount";
import { RouletteAtomsProvider } from "./ScreenRoulette/AtomsCtx";
import { WheelData } from "./ScreenRoulette/Roulette/models";
import {
  Games,
  SettingsAtomsCtx,
  withProvider as withSettingsProvider,
} from "./ScreenSettings/AtomsCtx";
import { ContextuallyService } from "./Services/ContextuallyService";
import { DonateAtomsProvider, DonateService } from "./Services/DonateService";
import { TrovoAtomsProvider, TrovoService } from "./Services/TrovoService";
import { TwichAtomsProvider, TwichService } from "./Services/TwichService";
import { Sidebar } from "./Sidebar";

const Root = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar body"
    "sidebar body";
  grid-template-rows: 50px 1fr;
  grid-template-columns: auto 1fr;
  height: 100%;
`;

const SidebarArea = styled.div`
  grid-area: sidebar;
  display: flex;
`;

const BodyArea = styled.div`
  grid-area: body;
  margin: 0.5rem 0.5rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
`;

export const RouletteWrap = memo(({ children }: { children: React.ReactNode }) => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const lots = useAtomValue(lotsAtom);
  const totalAmount = useTotalAmount();

  const data: WheelData[] = useMemo(() => {
    const result = lots.map(x => {
      const sum = x.sum || 0;
      return {
        id: x.id,
        name: x.name,
        value: sum,
        percent: sum / totalAmount,
      };
    });

    return result;
  }, [lots, totalAmount]);

  return <RouletteAtomsProvider wheelData={data}>{children}</RouletteAtomsProvider>;
});

const Providers = withSettingsProvider(
  memo(() => {
    const { settingsAtom } = useContext(SettingsAtomsCtx);
    const settings = useAtomValue(settingsAtom);

    const totalMilliseconds = useMemo(() => {
      return settings.timer.defaultMinutes * 60 * 1000;
    }, [settings.timer.defaultMinutes]);

    const addMilliseconds = useMemo(() => {
      return settings.timer.addSeconds * 1000;
    }, [settings.timer.addSeconds]);

    const trovoChannel = useMemo(() => {
      return settings.integration.trovoChannel;
    }, [settings.integration.trovoChannel]);

    const twichChannel = useMemo(() => {
      return settings.integration.twichChannel;
    }, [settings.integration.twichChannel]);

    const twitchExchangeRate = useMemo(() => {
      return settings.integration.twitchExchangeRate;
    }, [settings.integration.twitchExchangeRate]);

    return (
      <>
        <DonateAtomsProvider>
          <TwichAtomsProvider channelUrl={twichChannel} exchangeRate={twitchExchangeRate}>
            <TrovoAtomsProvider channelUrl={trovoChannel}>
              <DonateService />
              <TrovoService />
              <TwichService />
              {settings.integration.game === Games.Contextually && <ContextuallyService />}

              <TimerAtomsProvider
                addMilliseconds={addMilliseconds}
                totalMilliseconds={totalMilliseconds}>
                <HomeAtomsProvider>
                  <FifteenAtomsProvider>
                    <MinesweeperAtomsProvider>
                      <DonateProcess />

                      <RouletteWrap>
                        <BodyArea>
                          <AppRouts />
                        </BodyArea>
                      </RouletteWrap>
                    </MinesweeperAtomsProvider>
                  </FifteenAtomsProvider>
                </HomeAtomsProvider>
              </TimerAtomsProvider>
            </TrovoAtomsProvider>
          </TwichAtomsProvider>
        </DonateAtomsProvider>
      </>
    );
  })
);

export const App = memo(() => {
  return (
    <Root>
      <SidebarArea>
        <Sidebar />
      </SidebarArea>

      <Providers />
    </Root>
  );
});
