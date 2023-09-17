import { memo } from "react";
import { FieldLotName } from "./FieldLotName";
import { HomeAtomsProvider } from "./AtomsCtx";
import { FieldLotSum } from "./FieldLotSum";
import styled from "styled-components";
import { ButtonAddLot } from "./ButtonAddLot";
import { LotTable } from "./LotTable";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from "react-perfect-scrollbar";
import { ButtonClearLots } from "./ButtonClearLots";
import { Timer } from "./Timer";

const Root = styled.div`
  display: grid;
  grid-template-areas:
    "header sidebar"
    "main sidebar";
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr auto;
  column-gap: 1rem;
  row-gap: 1rem;
  flex: auto;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Header = styled(Row)`
  grid-area: header;
  display: flex;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
`;

const Main = styled.div`
  grid-area: main;
  overflow: hidden;
`;

export const Screen = memo(() => {
  return (
    <HomeAtomsProvider>
      <Root>
        <Header>
          <FieldLotName />
          <FieldLotSum />
          <ButtonAddLot />

          <ButtonClearLots />
        </Header>

        <Sidebar>
          <Timer />
        </Sidebar>
        <Main>
          <PerfectScrollbar>
            <LotTable />
          </PerfectScrollbar>
        </Main>
      </Root>
    </HomeAtomsProvider>
  );
});
