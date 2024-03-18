import React, { memo, useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { showWinWindowAtom } from "./atoms";
import { useContextuallyService } from "../../../Services/ContextuallyService";
import { ScoreResponce } from "../../../Services/ContextuallyService/models";

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  max-height: 80%;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const FlexCnt = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
`;

const WinMsg = styled.div`
  color: var(--secondaryColor500);
  font-size: 2rem;
`;

let timeout = 0;

export const WinMessage = memo(() => {
  const [showWinWindow, setShowWinWindow] = useAtom(showWinWindowAtom);
  
  const { initRandomChallenge } = useContextuallyService();

  const onClose = useCallback(() => {
    initRandomChallenge();
    setShowWinWindow({} as ScoreResponce);
  }, [initRandomChallenge, setShowWinWindow]);

  useEffect(() => {
    if (showWinWindow?.id) {
      timeout = window.setTimeout(() => {
        onClose();
      }, 10000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose, showWinWindow?.id]);

  if (!showWinWindow?.id) {
    return null;
  }

  return (
    <Root onClick={onClose}>
      <Message>
        <FlexCnt>
          <WinMsg>{showWinWindow.word}</WinMsg>
          <div>Попыток: {showWinWindow.tries}</div>
        </FlexCnt>
      </Message>
    </Root>
  );
});
