import React, { memo, useContext, useMemo } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { FifteenAtomsCtx } from "./AtomsCtx";
import { Item } from "./Item";
import { Process } from "./Process";
import { WinMessage } from "./WinMessage";
import { Games, SettingsAtomsCtx } from "../../ScreenSettings/AtomsCtx";

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
  const { fifteenAtom, timeLeftAtom } = useContext(FifteenAtomsCtx);
  const { settingsAtom } = useContext(SettingsAtomsCtx);

  const settings = useAtomValue(settingsAtom);
  const fifteen = useAtomValue(fifteenAtom);
  const timeLeft = useAtomValue(timeLeftAtom);

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

  if (
    (settings.integration && !integratedChat.length) ||
    settings.integration.game !== Games.Fifteen
  ) {
    return null;
  }

  return (
    <Root>
      <div>Пятнашки для {integratedChat.join(", ")}</div>
      <span>Напиши в чат цифру и она подвинется через {timeLeft} секунд</span>

      <Process />

      <Fifteen>
        <WinMessage />

        {fifteen.data?.map(x => {
          return <Item key={`Item_${x.column}_${x.row}`} tableItem={x} />;
        })}
      </Fifteen>
    </Root>
  );
});
