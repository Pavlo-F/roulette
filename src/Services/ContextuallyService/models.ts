export type ScoreRequest = {
  challenge_id: string;
  user_id: string;
  word: string;
  challenge_type: string;
};

export type TipRequest = {
  challenge_id: string;
  user_id: string;
  challenge_type: string;
};

export type ScoreResponce = {
  id: string;
  completed: boolean;
  details: string;
  error: boolean;
  rank: number;
  tips: number;
  tries: number;
  word: string;
};
