import React, { ChangeEvent, memo, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { ButtonAddLot } from "./ButtonAddLot";
import { Header } from "./Header";
import { DonateSource } from "../../Services/DonateService/AtomsCtx";
import { TextArea } from "../../components/TextArea";

const Root = styled.div<{ $isAlarm: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.$isAlarm ? "#7e1e1e" : "var(--primaryColor700)")};
  border-radius: 4px;
  padding: 0.5rem 0.5rem;

  animation: lot-fade-in-keyframes 0.5s;
  @keyframes lot-fade-in-keyframes {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Body = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex: auto;
  word-wrap: anywhere;
`;

const TextAreaSt = styled(TextArea)`
  width: 100%;
  max-height: 10rem;
`;

const Alarm = styled.div`
  width: 100%;
  max-height: 10rem;
  background-color: #7e1e1e;
`;

type Props = {
  id: string;
  sum: number;
  name: string;
  comment: string;
  currency: string;
  source: DonateSource;
};

const blackList = ["бивень", "бивинь", "человеческая многоножка", "трусонюх", "смута"];

export const NewLot = memo(({ id, sum, name, comment, currency, source }: Props) => {
  const [newComment, setNewComment] = useState(comment);

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setNewComment(newValue);
  }, []);

  const blackListItem = useMemo(() => {
    for (let i = 0; i < blackList.length; i += 1) {
      if (comment && comment.trim().toLowerCase().indexOf(blackList[i]) >= 0) {
        return blackList[i];
      }
    }

    return "";
  }, [comment]);

  return (
    <Root $isAlarm={!!blackListItem} className="fade-in">
      <Header id={id} userName={name} currency={currency} sum={sum} source={source} />
      {!!blackListItem && (
        <Alarm>
          Поберегите свой рассудок. Не добавляйте &quot;{blackListItem}&quot;. Вы не сможете это
          развидеть. Бегите, глупцы...
        </Alarm>
      )}
      <Body>
        <TextAreaSt rows={4} value={newComment} onChange={onChange} onBlur={onChange} />
      </Body>
      <ButtonAddLot id={id} name={newComment} sum={sum} userName={name} />
    </Root>
  );
});
