import React, { memo, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAtom } from "jotai";
import styled from "styled-components";
import { NewLot } from "./NewLot";
import { HomeAtomsCtx } from "../AtomsCtx";

const Root = styled.div`
  margin: 2rem 0 0 1rem;
  max-width: 20rem;
  height: 100%;
`;

const ScrolCnt = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Form = memo(() => {
  const { lotsAtom, newLotsAtom } = useContext(HomeAtomsCtx);

  const [lots, setLots] = useAtom(lotsAtom);
  const [newLots, setNewLots] = useAtom(newLotsAtom);

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
              />
            );
          })}
        </ScrolCnt>
      </PerfectScrollbar>
    </Root>
  );
});
