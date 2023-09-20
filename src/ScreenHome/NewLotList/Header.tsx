import React, { memo, useCallback, useContext } from "react";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import SvgClose from "./ic_close.svg";
import { ButtonSvg } from "../../components/ButtonSvg";
import { HomeAtomsCtx } from "../AtomsCtx";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const User = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 16rem;
`;

type Props = {
  id: string;
  userName: string;
  sum: number;
  currency: string;
};

export const Header = memo(({ id, currency, sum, userName }: Props) => {
  const { newLotsAtom } = useContext(HomeAtomsCtx);
  const setNewLots = useSetAtom(newLotsAtom);

  const onClose = useCallback(() => {
    setNewLots(old => {
      const result = old.filter(x => x.id !== id);
      return result;
    });
  }, [id, setNewLots]);

  return (
    <Root>
      <User>{sum} {currency.toLocaleLowerCase()} - {userName}</User>
      <ButtonSvg onClick={onClose}>
        <SvgClose />
      </ButtonSvg>
    </Root>
  );
});
