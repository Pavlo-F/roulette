import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { AppRouts } from "./AppRouts";
import { DonateProcess, HomeAtomsProvider, TimerAtomsProvider } from "./ScreenHome";
import { FifteenAtomsProvider } from "./ScreenHome/Games/Fifteen";
import { MinesweeperAtomsProvider } from "./ScreenHome/Games/Minesweeper/AtomsCtx";
import { InteractiveProcess } from "./ScreenInteractive";
import { InteractiveSettingsAtomsProvider } from "./ScreenInteractive/AtomsCtx";
import { Games, SettingsAtomsCtx, SettingsAtomsProvider } from "./ScreenSettings/AtomsCtx";
import { ContextuallyService } from "./Services/ContextuallyService";
import { DonateAtomsProvider, DonateService } from "./Services/DonateService";
import { TrovoAtomsProvider, TrovoService } from "./Services/TrovoService";
import { TwitchAtomsProvider, TwitchService } from "./Services/TwitchService";
import { Sidebar } from "./Sidebar";

const Root = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar body"
    "sidebar body";
  grid-template-rows: 50px 1fr;
  grid-template-columns: auto 1fr;
  height: 100%;
  color: var(--primaryTextColor);
  background-color: var(--primaryColor800);
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

export const App = memo(() => {
  const rootRef = useRef(null);
  const [rootNode, setRootNode] = useState<HTMLElement>();

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

  const twitchChannel = useMemo(() => {
    return settings.integration.twichChannel;
  }, [settings.integration.twichChannel]);

  const twitchExchangeRate = useMemo(() => {
    return settings.integration.twitchExchangeRate;
  }, [settings.integration.twitchExchangeRate]);

  useEffect(() => {
    setTimeout(() => {
      setRootNode(rootRef.current!);
    }, 1000);
  }, []);

  return (
    <Root ref={rootRef}>
      <SettingsAtomsProvider>
        <DonateAtomsProvider>
          <TwitchAtomsProvider channelUrl={twitchChannel} exchangeRate={twitchExchangeRate}>
            <TrovoAtomsProvider channelUrl={trovoChannel}>
              <DonateService />
              <TrovoService />
              <TwitchService />
              {settings.integration.game === Games.Contextually && <ContextuallyService />}

              <TimerAtomsProvider
                addMilliseconds={addMilliseconds}
                totalMilliseconds={totalMilliseconds}>
                <HomeAtomsProvider>
                  <FifteenAtomsProvider>
                    <MinesweeperAtomsProvider>
                      <DonateProcess />

                      <InteractiveSettingsAtomsProvider rootNode={rootNode}>
                        <InteractiveProcess />

                        <SidebarArea>
                          <Sidebar />
                        </SidebarArea>

                        <BodyArea>
                          <AppRouts />
                        </BodyArea>
                      </InteractiveSettingsAtomsProvider>
                    </MinesweeperAtomsProvider>
                  </FifteenAtomsProvider>
                </HomeAtomsProvider>
              </TimerAtomsProvider>
            </TrovoAtomsProvider>
          </TwitchAtomsProvider>
        </DonateAtomsProvider>
      </SettingsAtomsProvider>
    </Root>
  );
});
