import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { AppRouts } from "./AppRouts";
import { TimerAtomsProvider } from "./ScreenHome/Timer/AtomsCtx";
import {
  SettingsAtomsCtx,
  withProvider as withSettingsProvider,
} from "./ScreenSettings/AtomsCtx";
import { Sidebar } from "./Sidebar";

// import { Header } from "./Header";

const Root = styled.div`
  display: grid;
  grid-template-areas:
    /* "sidebar header" */
    "sidebar body"
    "sidebar body";
  grid-template-rows: 50px 1fr;
  grid-template-columns: auto 1fr;
  height: 100%;
`;

// const HeaderArea = styled.div`
//   grid-area: header;
// `;

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

    return (
      <TimerAtomsProvider
        addMilliseconds={addMilliseconds}
        totalMilliseconds={totalMilliseconds}>
        <BodyArea>
          <AppRouts />
        </BodyArea>
      </TimerAtomsProvider>
    );
  })
);

function App() {
  return (
    <Root>
      {/* <HeaderArea>
        <Header />
      </HeaderArea> */}

      <SidebarArea>
        <Sidebar />
      </SidebarArea>

      <Providers />
    </Root>
  );
}

export default App;
