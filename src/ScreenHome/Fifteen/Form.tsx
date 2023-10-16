import React, { memo, useContext } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx } from "./AtomsCtx";
import { Item } from "./Item";

const Root = styled.div`
  color: var(--borderColor);
  display: flex;
  flex-direction: column;
`;

const Fifteen = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  flex: auto;
  z-index: 10;
  margin-bottom: 0.1rem;
  margin-top: 1rem;
  row-gap: 1px;
`;

export const Form = memo(() => {
  const { fifteenAtom } = useContext(FifteenAtomsCtx);
  const fifteen = useAtomValue(fifteenAtom);

  return (
    <Root>
      <div>Пятнашки для Trovo</div>
      <span>Напиши в чат цифру и она подвинется через 6 секунд</span>

      <Fifteen>
        {fifteen.data.map(x => {
          return <Item key={`Item_${x.column}_${x.row}`} tableItem={x} />;
        })}
      </Fifteen>
    </Root>
  );
});
