import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useAtom } from "jotai";
import ButtonPrimary from "../components/ButtonPrimary";
import { HomeAtomsCtx, TableData } from "./AtomsCtx";

export const ButtonAddLot = memo(() => {
  const { lotsAtom, lotAtom } = useContext(HomeAtomsCtx);
  const [lots, setLots] = useAtom(lotsAtom);
  const [lot, setLot] = useAtom(lotAtom);
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
      name: lot.name,
      sum: lot.sum,
      order,
    };

    setLots(draft => {
      draft.push(newItem);

      return [...draft];
    });

    setOrder(draft => draft + 1);

    setLot({ name: "", sum: undefined });
  }, [lot.name, lot.sum, order, setLot, setLots]);

  return <ButtonPrimary onClick={onClick}>Добавить</ButtonPrimary>;
});
