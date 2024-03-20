import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx } from "./AtomsCtx";
import { shuffleArray } from "../../../Utils/common";

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
  max-height: 50%;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--primaryColor700);
`;

const FlexCnt = styled.div`
  display: flex;
  flex: auto;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--secondaryColor500);
  padding: 1rem;
`;

const WinMsg = styled.div`
  color: #53ce31;
`;

let timeout = 0;

export const WinMessage = memo(() => {
  const { fifteenAtom } = useContext(FifteenAtomsCtx);
  const [fifteen, setFifteen] = useAtom(fifteenAtom);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    let result = true;
    let prev = 0;

    for (let i = 0; i < fifteen.data.length - 1; i += 1) {
      result &&= prev + 1 === fifteen.data[i].value;
      prev = fifteen.data[i].value;

      if (!result) {
        break;
      }
    }

    setIsWin(result);

    if (result) {
      timeout = window.setTimeout(() => {
        const newData = shuffleArray(fifteen.data);
        setFifteen({ data: newData });
      }, 10000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [fifteen.data, setFifteen]);

  const onClose = useCallback(() => {
    const newData = shuffleArray(fifteen.data);
    setFifteen({ data: newData });
    setIsWin(false);
  }, [fifteen.data, setFifteen]);

  if (!isWin) {
    return null;
  }

  return (
    <Root onClick={onClose}>
      <Message>
        <FlexCnt>
          <WinMsg>Чатик, Вы лучшие игроки в Пятнашки!</WinMsg>
        </FlexCnt>
      </Message>
    </Root>
  );
});
