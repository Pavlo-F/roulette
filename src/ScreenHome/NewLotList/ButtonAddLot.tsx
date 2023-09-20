import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import ButtonPrimary from "../../components/ButtonPrimary";
import { HomeAtomsCtx, TableData } from "../AtomsCtx";
import { TimerAtomsCtx } from "../Timer/AtomsCtx";

const ButtonPrimarySt = styled(ButtonPrimary)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  height: 32px;
  background-color: transparent;
  width: 10rem;
`;

type Props = {
  id: string;
  name: string;
  sum: number;
};

export const ButtonAddLot = memo(({ id, name, sum }: Props) => {
  const { addTime } = useContext(TimerAtomsCtx);
  const { lotsAtom, newLotsAtom } = useContext(HomeAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (!lots.length) {
      return;
    }

    const result = Math.max(...lots.map(x => x.order));
    setOrder(result + 1);
  }, [lots]);

  const onClick = useCallback(() => {
    const newItem: TableData = {
      id: new Date().getTime().toString(),
      name,
      sum,
      order,
    };

    setLots(draft => {
      draft.push(newItem);
      return [...draft];
    });

    setNewLots(old => {
      const result = old.filter(x => x.id !== id);
      return result;
    });

    addTime(1);
  }, [addTime, id, name, order, setLots, setNewLots, sum]);

  return <ButtonPrimarySt onClick={onClick}>Добавить</ButtonPrimarySt>;
});
