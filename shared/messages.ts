export interface Connect {
  type: 'CONNECT';
}

export interface Disconnect {
  type: 'DISCONNECT';
}

export interface Score {
  type: 'SCORE';
  value: number;
}

export interface Finish {
  type: 'FINISH';
}

export interface Restart {
  type: 'RESTART';
}

export type Message = Connect | Disconnect | Score | Finish | Restart;
export type ClientMessage = Message & { clientId: number };
