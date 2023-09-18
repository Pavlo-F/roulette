import React, { memo } from "react";
import styled from "styled-components";
import { ButtonDeleteLot } from "./ButtonDeleteLot";

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0rem 0 2rem;
`;

type Props = {
  id: string;
};

export const ColumnActions = memo(({ id }: Props) => {
  return (
    <Root>
      <ButtonDeleteLot id={id} />
    </Root>
  );
});
