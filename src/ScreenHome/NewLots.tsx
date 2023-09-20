import React, { memo, useContext } from "react";
import { useAtom } from "jotai";
import { HomeAtomsCtx } from "./AtomsCtx";

export const NewLots = memo(() => {
  const { lotsAtom, newLotsAtom } = useContext(HomeAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const [newLots, setNewLots] = useAtom(newLotsAtom);

  return <>
  {newLots.map(x => {
    return <div key={x.id}>{x.name}</div>;
  })}
  </>;
});
