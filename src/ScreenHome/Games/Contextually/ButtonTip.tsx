import React, { memo, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import { contextuallyAtom, showWinWindowAtom } from "./atoms";
import SvgTip from "./ic_tip.svg";
import { useContextuallyService } from "../../../Services/ContextuallyService";
import { ButtonSvg } from "../../../components/ButtonSvg";

const Root = styled(ButtonSvg)`
  display: inline-flex;
  width: 1.3rem;
`;

export const ButtonTip = memo(() => {
  const { getTip } = useContextuallyService();
  const showWinWindow = useSetAtom(showWinWindowAtom);
  const [contextually, setContextually] = useAtom(contextuallyAtom);

  const onClick = useCallback(() => {
    getTip().then(data => {
      if (data.data.completed) {
        showWinWindow(data.data);
      }

      setContextually(draft => {
        const result = [...draft];
        result.push({ ...data.data, id: new Date().getTime().toString() });
        return result;
      });
    });
  }, [getTip, setContextually, showWinWindow]);

  if (!contextually?.length) {
    return null;
  }

  return (
    <Root title="Подсказка" onClick={onClick}>
      <SvgTip />
    </Root>
  );
});
