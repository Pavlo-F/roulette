import React, { memo, useContext } from "react";
import { useAtomValue } from "jotai";
import { statusMap } from "./AtomsCtx";
import { TwichAtomsCtx } from "../Services/TwichService";

export const TwichStatus = memo(() => {
  const { connectStatusAtom } = useContext(TwichAtomsCtx);
  const connectStatus = useAtomValue(connectStatusAtom);

  return <div>{statusMap[connectStatus]}</div>;
});
