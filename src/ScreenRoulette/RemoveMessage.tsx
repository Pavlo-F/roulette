import React, { memo, useCallback, useContext } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
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
  align-items: center;
  justify-content: center;
  max-width: 40rem;
  max-height: 80vh;
  min-width: 10rem;
  padding: 2rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const Body = styled.div`
  font-size: 2rem;
  word-wrap: anywhere;
  text-align: center;
`;

const Percent = styled.div`
  font-size: 1rem;
  color: var(--primaryTextColor);
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
        <Body>
          {removeMessage.name}
          <Percent>
            {removeMessage.value} - (
            {(removeMessage.percent * 100).toLocaleString("ru-ru", { maximumFractionDigits: 2 })}%)
          </Percent>
          <Percent>{!!removeMessage.userName && removeMessage.userName}</Percent>
        </Body>
      </Message>
    </Root>
  );
});
