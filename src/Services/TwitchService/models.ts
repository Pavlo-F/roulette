import { ChatMessage } from "@twurple/chat";

export type Chat = {
  channel: string;
  user: string;
  text: string;
  msg: ChatMessage;
};

export type AccessToken = {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    scope: string[];
    tokenType: string;
};