import React, { ChangeEvent, memo, useCallback, useState } from "react";
import { ChatMessage } from "@twurple/chat";
import ButtonPrimary from "../../components/ButtonPrimary";
import { Input } from "../../components/Input";
import { addChatMessage } from "../../Services/TwitchService/AtomsCtx";

export const DebugFormTwitch = memo(() => {
  const [input, setInput] = useState("");

  const onClick = useCallback(() => {
    addChatMessage({ channel: "channel", user: "user", text: input, msg: {} as ChatMessage });
  }, [input]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInput(newValue);
  }, []);

  return (
    <>
      <ButtonPrimary onClick={onClick}>send</ButtonPrimary>
      <Input onChange={onChange} />
    </>
  );
});
