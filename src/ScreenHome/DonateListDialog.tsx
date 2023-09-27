import React, { memo, useCallback, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { HomeAtomsCtx } from "./AtomsCtx";
import { DonateAtomsCtx } from "../Services/DonateService";
import { DonateSource } from "../Services/DonateService/AtomsCtx";

const IMAGES = {
  PngDonatePay: new URL("./ic_dp.png", import.meta.url).href,
  PngDonationAlerts: new URL("./ic_da.png", import.meta.url).href,
};

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 40rem;
  min-width: 20rem;
  max-height: 80vh;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const Grid = styled.div`
  display: grid;
  column-gap: 1rem;
  row-gap: 0.3rem;
  grid-template-columns: 2rem 7.3rem 6rem 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    "icon date amount user"
    "icon comment comment comment";
  border-bottom: 1px solid var(--borderColor);
  padding-bottom: 0.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Amount = styled.div`
  grid-area: amount;
  display: flex;
  flex-direction: column;
`;

const User = styled.div`
  grid-area: user;
  overflow: hidden;
  word-wrap: anywhere;
`;

const Comment = styled.div`
  grid-area: comment;
  overflow: hidden;
  word-wrap: anywhere;
  font-size: 0.9rem;
`;

const Date = styled.div`
  grid-area: date;
  font-size: 0.9rem;
  line-height: 24px;
  opacity: 0.5;
`;

const IconCnt = styled.div`
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
`;

export const DonateListDialog = memo(() => {
  const { donatesVisibleAtom } = useContext(HomeAtomsCtx);
  const { donateListAtom } = useContext(DonateAtomsCtx);

  const [donatesVisible, setDonatesVisible] = useAtom(donatesVisibleAtom);
  const donateList = useAtomValue(donateListAtom);

  const onClick = useCallback(() => {
    setDonatesVisible(false);
  }, [setDonatesVisible]);

  if (!donatesVisible) {
    return null;
  }

  return (
    <Root>
      <Body>
        <PerfectScrollbar>
          <List>
            {donateList.map(x => {
              return (
                <Grid>
                  <IconCnt key={x.id}>
                    {x.source === DonateSource.DonatePay && (
                      <Icon src={IMAGES.PngDonatePay} alt="DonatePay" />
                    )}
                    {x.source === DonateSource.DonationAlerts && (
                      <Icon src={IMAGES.PngDonationAlerts} alt="DonationAlerts" />
                    )}
                  </IconCnt>
                  <Date>{dayjs(x.date).format("DD.MM.YYYY HH:mm")}</Date>
                  <Amount>{`${x.sum} ${x.currency.toLowerCase()}`}</Amount>
                  <User>{x.name}</User>
                  <Comment>{x.comment}</Comment>
                </Grid>
              );
            })}
          </List>
        </PerfectScrollbar>

        <Footer>
          <ButtonPrimary onClick={onClick}>Закрыть</ButtonPrimary>
        </Footer>
      </Body>
    </Root>
  );
});
