
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface Message {
  role: MessageRole;
  content: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
}
