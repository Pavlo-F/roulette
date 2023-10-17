import React, { memo, useContext } from "react";
import { useAtomValue } from "jotai";
import { statusMap } from "./AtomsCtx";
import { TrovoAtomsCtx } from "../Services/TrovoService";

export const TrovoStatus = memo(() => {
  const { connectStatusAtom } = useContext(TrovoAtomsCtx);
  const connectStatus = useAtomValue(connectStatusAtom);

  return <div>{statusMap[connectStatus]}</div>;
});
