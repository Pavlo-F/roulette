import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import { HomeAtomsCtx } from "../AtomsCtx";

export const useTotalAmount = () => {
  const { lotsAtom } = useContext(HomeAtomsCtx);
  const lots = useAtomValue(lotsAtom);
  
  const totalAmount = useMemo(() => {
    const result = lots.reduce((a, b) => a + (b.sum || 0), 0);
    return result;
  }, [lots]);
  
  return totalAmount;
};