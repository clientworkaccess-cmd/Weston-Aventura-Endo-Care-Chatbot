export type Sender = 'user' | 'bot';

export interface ActionButton {
  label: string;
  value?: string; // Text to send back to chat when clicked
  url?: string;   // External link
  type: 'action' | 'link';
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  buttons?: ActionButton[];
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  sessionId: string;
}

export interface WebhookResponse {
  output?: string;
  text?: string;
  message?: string;
  buttons?: ActionButton[];
  // n8n might return an array of objects sometimes
  [key: string]: any;
}