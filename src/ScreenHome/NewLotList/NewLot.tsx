import React, { ChangeEvent, memo, useCallback, useMemo, useState } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { ButtonAddBoringLot } from "./ButtonAddBoringLot";
import { ButtonAddLot } from "./ButtonAddLot";
import { Header } from "./Header";
import { DonateSource } from "../../Services/DonateService/AtomsCtx";
import { TextArea } from "../../components/TextArea";
import { DragableTypes, DropType } from "../LotTable/DragDropModels";

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

const blackList = ["бивень", "бивинь", "человеческая многоножка", "трусонюх"];
const boringList = ["вв ", " вв", "великолепный век", "велеколепный век"];

export const NewLot = memo(({ id, sum, name, comment, currency, source }: Props) => {
  const [newComment, setNewComment] = useState(comment);

  const [{ opacity }, drag] = useDrag(
    () => ({
      type: DragableTypes.NewLot,
      item: { id, sum, comment } as DropType,
      options: {
        dropEffect: "move",
      },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    []
  );

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

  const boringListItem = useMemo(() => {
    for (let i = 0; i < boringList.length; i += 1) {
      if (
        (comment && comment.trim().toLowerCase().indexOf(boringList[i]) >= 0) ||
        comment.trim().toLowerCase() === "вв"
      ) {
        return boringList[i];
      }
    }

    return "";
  }, [comment]);

  const isBoring = !!boringListItem && !blackListItem;

  return (
    <Root $isAlarm={!!blackListItem || !!boringListItem} className="fade-in" style={{ opacity }}>
      <Header
        dragRef={drag}
        style={{ opacity, cursor: "move" }}
        id={id}
        userName={name}
        currency={currency}
        sum={sum}
        source={source}
      />
      {!!blackListItem && (
        <Alarm>
          Поберегите свой рассудок. Не добавляйте &quot;{blackListItem}&quot;. Вы не сможете это
          развидеть. Бегите, глупцы...
        </Alarm>
      )}
      {isBoring && (
        <Alarm>
          {name} передумай пока не поздно, пожалей стримера и чатик. Ну пожалуйстааааа...
          Я верю, что ты не хотел так поступать, давай жить дружно.
        </Alarm>
      )}
      <Body>
        <TextAreaSt rows={4} value={newComment} onChange={onChange} onBlur={onChange} />
      </Body>
      {!isBoring && <ButtonAddLot id={id} name={newComment} sum={sum} userName={name} />}
      {isBoring && <ButtonAddBoringLot id={id} name={newComment} sum={sum} userName={name} />}
    </Root>
  );
});
