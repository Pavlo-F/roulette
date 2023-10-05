import React, { memo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import styled from "styled-components";
import { ButtonAddLot } from "./ButtonAddLot";
import { ButtonClearLots } from "./ButtonClearLots";
import { ButtonShowDonates } from "./ButtonShowDonates";
import { DonateListDialog } from "./DonateListDialog";
import { FieldLotName } from "./FieldLotName";
import { FieldLotSum } from "./FieldLotSum";
import { LotTable } from "./LotTable";
import { NewLotList } from "./NewLotList";
import { Timer } from "./Timer";
import { BackAnimations } from "./BackAnimations";

const Root = styled.div`
  position: relative;
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
  z-index: 10;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const Main = styled.div`
  grid-area: main;
  overflow: hidden;
`;

export const Screen = memo(() => {
  return (
    <Root>
      <BackAnimations />
      
      <Header>
        <FieldLotName />
        <FieldLotSum />
        <ButtonAddLot />
        <ButtonShowDonates />

        <ButtonClearLots />
      </Header>

      <Sidebar>
        <Timer />
        <NewLotList />
      </Sidebar>
      <Main>
        <PerfectScrollbar>
          <LotTable />
        </PerfectScrollbar>
      </Main>

      <DonateListDialog />
    </Root>
  );
});
