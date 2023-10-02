import React, { memo, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { NewLot } from "./NewLot";
import { HomeAtomsCtx } from "../AtomsCtx";

const Root = styled.div`
  margin: 2rem 0 0 1rem;
  max-width: 20rem;
  flex: auto;
  position: relative;
  overflow: hidden;
`;

const ScrolCnt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Form = memo(() => {
  const { newLotsAtom } = useContext(HomeAtomsCtx);

  const newLots = useAtomValue(newLotsAtom);

  return (
    <Root>
      <PerfectScrollbar>
        <ScrolCnt>
          {newLots.map(x => {
            return (
              <NewLot
                key={x.id}
                id={x.id}
                comment={x.comment}
                sum={x.sum || 0}
                name={x.name || ""}
                currency={x.currency}
                source={x.source}
              />
            );
          })}
        </ScrolCnt>
      </PerfectScrollbar>
    </Root>
  );
});
