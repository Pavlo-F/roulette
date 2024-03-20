import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled, { css } from "styled-components";
import { ButtonTip } from "./ButtonTip";
import { Process } from "./Process";
import { Rules } from "./Rules";
import { Votes } from "./Votes";
import { WinMessage } from "./WinMessage";
import { contextuallyAtom, fetchMessageAtom, timeLeftAtom } from "./atoms";
import { Games, SettingsAtomsCtx } from "../../../ScreenSettings/AtomsCtx";

const Root = styled.div`
  color: var(--borderColor);
  display: flex;
  flex-direction: column;
`;

const Game = styled.div`
  position: relative;
  display: flex;
  flex: auto;
  flex-direction: column;
  z-index: 10;
  margin-bottom: 0.1rem;
  gap: 0.2rem;
  max-height: 10rem;
  min-height: 7rem;
`;

const Item = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.5rem;
  border: 1px solid var(--borderColor);
  border-radius: 5px;
`;

const Text = styled.span<{ $width: number }>`
  padding: 0 0.5rem;

  ${props => {
    if (props.$width > 0) {
      return css`
        font-weight: 500;
        color: #fff;
      `;
    }
  }};
`;

const Bacground = styled.div<{ $width: number }>`
  position: absolute;
  background-color: #006f4a;
  height: 100%;
  z-index: -1;

  ${props => css`
    width: ${props.$width}%;
  `};
`;

const Message = styled.div`
  max-height: 5rem;
  color: #fff;
`;

const FixedWidth = styled.div`
  width: 1.3rem;
  display: inline-block;
  text-align: center;
`;

export const Form = memo(() => {
  const contextually = useAtomValue(contextuallyAtom);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const settings = useAtomValue(settingsAtom);
  const timeLeft = useAtomValue(timeLeftAtom);
  const fetchMessage = useAtomValue(fetchMessageAtom);

  const integratedChat = useMemo(() => {
    const result = [];
    if (settings.integration.trovoChannel) {
      result.push("Trovo");
    }

    if (settings.integration.twichChannel) {
      result.push("Twitch");
    }

    return result;
  }, [settings.integration.trovoChannel, settings.integration.twichChannel]);

  const sortedContextually = useMemo(() => {
    return contextually?.sort((a, b) => a.rank - b.rank).slice(0, 5) || [];
  }, [contextually]);

  if (
    (settings.integration && !integratedChat.length) ||
    settings.integration.game !== Games.Contextually
  ) {
    return null;
  }

  return (
    <Root>
      <div>Контекстно для {integratedChat.join(", ")}</div>
      <span>
        Напиши в чат слово для проверки. Результат через <FixedWidth>{timeLeft}</FixedWidth> секунд.{" "}
        <ButtonTip />
      </span>

      <Votes />
      <Message>{fetchMessage}</Message>

      <Process />

      {!sortedContextually.length && <Rules />}

      {!!sortedContextually.length && (
        <Game>
          <WinMessage />

          {sortedContextually.map(x => {
            const percent = x.rank > 1000 ? 0 : 100 - (x.rank / 1000) * 100;
            return (
              <Item key={`Item_${x.id}`}>
                <Bacground $width={percent} />
                <Text $width={percent}>{x.word}</Text>
                <Text $width={percent}>{x.rank}</Text>
              </Item>
            );
          })}
        </Game>
      )}
    </Root>
  );
});
