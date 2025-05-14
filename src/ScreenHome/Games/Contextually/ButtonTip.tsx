import React, { memo, useCallback } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { contextuallyAtom } from "./atoms";
import { useGetTip } from "./useGetTip";

const Help = styled.span`
  color: #fff;
  cursor: pointer;
`;

export const ButtonTip = memo(() => {
  const contextually = useAtomValue(contextuallyAtom);
  const getTip = useGetTip();

  const onClick = useCallback(() => {
    getTip();
  }, [getTip]);

  if (!contextually?.length) {
    return null;
  }

  return (
    <span>
      Введите <Help onClick={onClick}>Подсказка</Help> для помощи
    </span>
  );
});
