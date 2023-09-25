import React, { memo, useCallback, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAtom } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../components/ButtonPrimary";
import { RouletteAtomsCtx } from "./AtomsCtx";

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
  min-width: 10rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const Title = styled.div`
`;

const Body = styled.div`
  margin-top: 1rem;
  word-wrap: anywhere;
`;

export const RemoveMessage = memo(() => {
  const { removeMessageAtom } = useContext(RouletteAtomsCtx);
  const [removeMessage, setRemoveMessage] = useAtom(removeMessageAtom);

  const onClose = useCallback(() => {
    setRemoveMessage(undefined);
  }, [setRemoveMessage]);

  if (!removeMessage) {
    return null;
  }

  return (
    <Root onClick={onClose}>
      <Message>
        <Title>Признан недостойным:</Title>
        <Body>{removeMessage.name}</Body>
      </Message>
    </Root>
  );
});
