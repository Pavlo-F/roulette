import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { SettingsAtomsCtx } from "../../ScreenSettings/AtomsCtx";
import ButtonPrimary from "../../components/ButtonPrimary";
import { HomeAtomsCtx, TableData } from "../AtomsCtx";
import { TimerAtomsCtx } from "../Timer/AtomsCtx";

const ButtonPrimarySt = styled(ButtonPrimary)`
  margin-left: auto;
  margin-top: 1rem;
  height: 32px;
  width: 7rem;
`;

type Props = {
  id: string;
  name: string;
  sum: number;
  userName: string;
};

export const ButtonAddLot = memo(({ id, name, sum, userName }: Props) => {
  const { addTime } = useContext(TimerAtomsCtx);
  const { lotsAtom, newLotsAtom } = useContext(HomeAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const setNewLots = useSetAtom(newLotsAtom);
  const [order, setOrder] = useState(0);
  const settings = useAtomValue(settingsAtom);

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
      userName,
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

    if (sum >= settings.timer.thresholdToAddTime) {
      addTime(settings.timer.timeForNewPosition * 1000);
    }
  }, [
    addTime,
    id,
    name,
    order,
    setLots,
    setNewLots,
    settings.timer.thresholdToAddTime,
    settings.timer.timeForNewPosition,
    sum,
    userName,
  ]);

  return <ButtonPrimarySt onClick={onClick}>Добавить</ButtonPrimarySt>;
});
