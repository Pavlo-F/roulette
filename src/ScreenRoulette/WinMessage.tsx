import React, { memo, useCallback, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { RouletteAtomsCtx } from "./AtomsCtx";
import { HomeAtomsCtx } from "../ScreenHome";

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 40rem;
  max-height: 80vh;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const Header = styled.div`
  font-size: 2rem;
  text-align: center;
`;

const Winner = styled.div`
  margin-top: 1rem;
  font-size: 1.5rem;
  text-align: center;
  color: var(--secondaryColor500);
  word-wrap: anywhere;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const FlexCnt = styled.div`
  display: flex;
  flex: auto;
  gap: 5rem;
  overflow: hidden;
`;

const ParticipantsTitle = styled.div`
  margin-top: 1rem;
  white-space: nowrap;
`;

const Participants = styled.div`
  margin-top: 1rem;
  max-width: 30rem;
  display: flex;
  flex: auto;
  gap: 0.5rem;
  overflow: auto;
  flex-wrap: wrap;
`;

const FlexAuto = styled.div`
  flex: auto;
`;

const ParticipantsCnt = styled.div`
  flex: 1;
  max-height: 20rem;
`;

export const WinMessage = memo(() => {
  const { winMessageAtom } = useContext(RouletteAtomsCtx);
  const { participantsAtom } = useContext(HomeAtomsCtx);

  const [winMessage, setWinMessage] = useAtom(winMessageAtom);
  const participants = useAtomValue(participantsAtom);

  const onClose = useCallback(() => {
    setWinMessage(undefined);
  }, [setWinMessage]);

  if (!winMessage) {
    return null;
  }

  return (
    <Root>
      <Message>
        <FlexCnt>
          <FlexAuto>
            <Header>Победитель</Header>
            <Winner>{winMessage.name}</Winner>
          </FlexAuto>
          <ParticipantsCnt>
            <PerfectScrollbar>
              <ParticipantsTitle>Спасибо участникам</ParticipantsTitle>
              <Participants>
                {participants.map(x => {
                  return <div key={x}>{x}</div>;
                })}
              </Participants>
            </PerfectScrollbar>
          </ParticipantsCnt>
        </FlexCnt>

        <Footer>
          <ButtonPrimary onClick={onClose}>Закрыть</ButtonPrimary>
        </Footer>
      </Message>
    </Root>
  );
});
