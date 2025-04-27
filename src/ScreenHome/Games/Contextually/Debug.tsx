import React, { useCallback, useState } from "react";
import { ChatMessage } from "@twurple/chat";
import { addChatMessage } from "../../../Services/TwitchService/AtomsCtx";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { Input } from "../../../components/Input";

export const Debug = () => {
  const [message, setMessage] = useState("");

  const onMessage = useCallback<React.ChangeEventHandler<HTMLInputElement>>(e => {
    setMessage(e.target.value);
  }, []);

  const handleSend = useCallback(() => {
    addChatMessage({
      channel: "channel",
      msg: {} as ChatMessage,
      text: message,
      user: "user",
    });
  }, [message]);

  return (
    <>
      <Input onChange={onMessage} />
      <ButtonPrimary onClick={handleSend}>Send</ButtonPrimary>
    </>
  );
};
