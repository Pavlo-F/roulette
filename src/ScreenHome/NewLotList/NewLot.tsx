import React, { ChangeEvent, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { ButtonAddLot } from "./ButtonAddLot";
import { Header } from "./Header";
import { Donate } from "../../Services/DonateService/AtomsCtx";
import { TextArea } from "../../components/TextArea";

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

const TextAreaSt = styled(TextArea)`
  width: 100%;
  max-height: 10rem;
`;

type Props = Donate;

export const NewLot = memo(({ id, sum, name, comment, currency }: Props) => {
  const [newComment, setNewComment] = useState(comment);

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setNewComment(newValue);
  }, []);

  return (
    <Root>
      <Header id={id} userName={name} currency={currency} sum={sum} />
      <Body>
        <TextAreaSt value={newComment} onChange={onChange} onBlur={onChange} />
      </Body>
      <ButtonAddLot id={id} name={newComment} sum={sum} />
    </Root>
  );
});
