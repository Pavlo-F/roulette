export enum MessageTypesEnum {
  Auth = "AUTH",
  Ping = "PING",
  Pong = "PONG",
  Response = "RESPONSE",
  Chat = "CHAT",
  Listen = "LISTEN",
}

export enum ChatTypes {
  Normal = 0,
}

export type Chat = {
  type: ChatTypes;
  content: string;
  nick_name: string;
  avatar: string;
  sub_lv: string;
  sub_tier: string;
  medals: string[];
  roles: string[];
  message_id: string;
  sender_id: number;
  send_time: number;
  uid: number;
  user_name: string;
  content_data: any;
  custom_role: any;
};

type Data = {
  eid: string;
  chats: Chat[];
};

export type ChatMessage = {
  type: MessageTypesEnum;
  channelInfo: { channelId: string };
  error: string;
  data: Data;
};

export type User = {
  userId: string;
  username: string;
  nickname: string;
  channelId: string;
}
