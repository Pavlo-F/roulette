//import { Header } from "./Header";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { AppRouts } from "./AppRouts";
import { TimerAtomsProvider } from "./ScreenHome/Timer/AtomsCtx";

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
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Root>
      {/* <HeaderArea>
        <Header />
      </HeaderArea> */}

      <SidebarArea>
        <Sidebar />
      </SidebarArea>

      <TimerAtomsProvider>
        <BodyArea>
          <AppRouts />
        </BodyArea>
      </TimerAtomsProvider>
    </Root>
  );
}

export default App;
