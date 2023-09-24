import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Roulette } from "./Roulette";
import { WheelData } from "./models";
import { HomeAtomsCtx } from "../../ScreenHome";
import { RouletteAtomsCtx, slowPhrases } from "../AtomsCtx";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

const Konva = styled.div`
  position: relative;
  flex: auto;
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
  const [slowPhraseIndex, setSlowPhraseIndex] = useState(-1);
  const [slowMessage, setSlowMessage] = useState(false);

  const { lotsAtom } = useContext(HomeAtomsCtx);
  const lots = useAtomValue(lotsAtom);

  const { modeAtom } = useContext(RouletteAtomsCtx);
  const mode = useAtomValue(modeAtom);

  useEffect(() => {
    if (cnt && cnt.current) {
      const result = Math.min(cnt.current.offsetWidth, cnt.current.offsetHeight);
      setRadius(result);
    }
  }, []);

  const slowPhrase = useMemo(() => {
    return slowPhrases[slowPhraseIndex];
  }, [slowPhraseIndex]);

  const data: WheelData[] = useMemo(() => {
    const result = lots.map(x => {
      return {
        id: x.id,
        name: x.name,
        value: x.sum || 0,
      };
    });

    return result;
  }, [lots]);

  const onSlow = useCallback(() => {
    setSlowPhraseIndex(old => {
      let result = old;
      const next = old + 1;

      if (next < slowPhrases.length) {
        result = next;
      } else {
        result = 0;
      }

      return result;
    });

    setSlowMessage(true);
  }, []);

  const onMessageClick = useCallback(() => {
    setSlowMessage(false);
  }, []);

  return (
    <Root id="Konva-cnt">
      <Konva ref={cnt}>
        {radius && <Roulette mode={mode} radius={radius / 2} data={data} onSlow={onSlow} />}
        {slowMessage && (
        <SlowMessageCnt onClick={onMessageClick}>
          <SlowMessage>{slowPhrase}</SlowMessage>
        </SlowMessageCnt>
      )}
      </Konva>

    </Root>
  );
});
