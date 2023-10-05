import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { Roulette } from "./Roulette";
import { WheelData } from "./models";
import { RouletteAtomsCtx, slowPhrases } from "../AtomsCtx";
import { RemoveMessage } from "../RemoveMessage";
import { WinMessage } from "../WinMessage";

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: auto;
`;

const Konva = styled.div`
  position: relative;
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlowMessageCnt = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const SlowMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25rem;
  height: 5rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

export const Form = memo(() => {
  const cnt = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);
  const [slowMessage, setSlowMessage] = useState("");

  const { modeAtom, winMessageAtom, removeMessageAtom } = useContext(RouletteAtomsCtx);
  const mode = useAtomValue(modeAtom);
  const setWinMessage = useSetAtom(winMessageAtom);
  const setRemoveMessage = useSetAtom(removeMessageAtom);

  useEffect(() => {
    if (cnt && cnt.current) {
      const result = Math.min(cnt.current.offsetWidth, cnt.current.offsetHeight);
      setRadius(result);
    }
  }, []);

  const onSlow = useCallback(() => {
    const result = Math.floor(Math.random() * slowPhrases.length); 
    setSlowMessage(slowPhrases[result]);
  }, []);

  const onSelected = useCallback((selected: WheelData) => {
    setRemoveMessage(selected);
  }, [setRemoveMessage]);

  const onWin = useCallback((selected: WheelData) => {
    setWinMessage(selected);
  }, [setWinMessage]);

  const onMessageClick = useCallback(() => {
    setSlowMessage("");
  }, []);

  return (
    <Root id="Konva-cnt">
      <Konva ref={cnt}>
        {!!radius && (
          <Roulette
            mode={mode}
            radius={radius / 2}
            onWin={onWin}
            onSlow={onSlow}
            onSelected={onSelected}
          />
        )}
        {slowMessage && (
          <SlowMessageCnt onClick={onMessageClick}>
            <SlowMessage>{slowMessage}</SlowMessage>
          </SlowMessageCnt>
        )}
      </Konva>

      <WinMessage />
      <RemoveMessage />
    </Root>
  );
});
