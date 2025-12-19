import React, { ChangeEvent, memo, useCallback, useMemo, useState } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { ButtonAddBoringLot } from "./ButtonAddBoringLot";
import { ButtonAddLot } from "./ButtonAddLot";
import { Header } from "./Header";
import SvgSnowflaker1 from "./snowflaker1.svg";
import SvgSnowflaker2 from "./snowflaker2.svg";
import SvgSnowflaker3 from "./snowflaker3.svg";
import SvgSnowflaker4 from "./snowflaker4.svg";
import SvgSnowflaker5 from "./snowflaker5.svg";
import { DonateSource } from "../../Services/DonateService/AtomsCtx";
import { TextArea } from "../../components/TextArea";
import { useIsChristmas } from "../../useIsChristmas";
import { DragableTypes, DropType } from "../LotTable/DragDropModels";

const Root = styled.div<{ $isAlarm: boolean }>`
  position: relative;
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
  background: transparent;
  z-index: 1;
`;

const Alarm = styled.div`
  width: 100%;
  max-height: 10rem;
  background-color: #7e1e1e;
`;

const Background = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  opacity: 0.1;
  justify-content: end;
`;

type Props = {
  id: string;
  sum: number;
  name: string;
  comment: string;
  currency: string;
  source: DonateSource;
};

const Images = [SvgSnowflaker1, SvgSnowflaker2, SvgSnowflaker3, SvgSnowflaker4, SvgSnowflaker5];

const blackList = ["бивень", "бивинь", "человеческая многоножка", "трусонюх"];
const boringList = ["вв ", " вв", "великолепный век", "велеколепный век"];

export const NewLot = memo(({ id, sum, name, comment, currency, source }: Props) => {
  const [newComment, setNewComment] = useState(comment);
  const isChristmas = useIsChristmas();

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

  const Back = useMemo(() => {
    const randIndex = Math.round(Math.random() * (Images.length - 1));
    return Images[randIndex];
  }, []);

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
          {name} передумай пока не поздно, пожалей стримера и чатик. Ну пожалуйстааааа... Я верю,
          что ты не хотел так поступать, давай жить дружно.
        </Alarm>
      )}
      <Body>
        {isChristmas && (
          <Background>
            <Back />
          </Background>
        )}

        <TextAreaSt rows={4} value={newComment} onChange={onChange} onBlur={onChange} />
      </Body>
      {!isBoring && <ButtonAddLot id={id} name={newComment} sum={sum} userName={name} />}
      {isBoring && <ButtonAddBoringLot id={id} name={newComment} sum={sum} userName={name} />}
    </Root>
  );
});
