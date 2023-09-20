import React, { memo } from "react";
import styled from "styled-components";
import { Header } from "./Header";
import { Donate } from "../../Services/DonateService/AtomsCtx";
import { ButtonAddLot } from "./ButtonAddLot";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--primaryColor700);
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
`;

const Body = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex: auto;
  max-width: 18.5rem;
  word-wrap: anywhere;
`;

type Props = Donate;

export const NewLot = memo(({ id, sum, name, comment, currency }: Props) => {
  return (
    <Root>
      <Header id={id} userName={name} currency={currency} sum={sum} />
      <Body>{comment}</Body>
      <ButtonAddLot id={id} name={comment} sum={sum} />
    </Root>
  );
});
