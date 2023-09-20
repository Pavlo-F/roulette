export type DonatePaySocketTokens = {
  token: string;
  userId: string;
};

export enum DonateServiceStatus {
  Connecting = "Connecting",
  Connected = "Connected",
  Reconnecting = "Reconnecting",
  Disconnected = "Disconnected",
  Error = "Error",
};
