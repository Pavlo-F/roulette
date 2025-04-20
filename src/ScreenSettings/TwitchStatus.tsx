import React, { memo, useContext } from "react";
import { useAtomValue } from "jotai";
import { statusMap } from "./AtomsCtx";
import { TwitchAtomsCtx } from "../Services/TwitchService";

export const TwitchStatus = memo(() => {
  const { connectStatusAtom } = useContext(TwitchAtomsCtx);
  const connectStatus = useAtomValue(connectStatusAtom);

  return <div>{statusMap[connectStatus]}</div>;
});
