export interface TimelineConversation {
  id: string;
  conversationId: string;
  status: string | null;
  summaryTitle: string | null;
  conversation_subtitle: string | null;
}

export interface TimelineSection {
  date: string;
  memoryLists: TimelineConversation[];
}

export interface ChatHistoryMeta {
  page: number;
  totalPages: number;
}

export interface ChatHistoryResponse {
  data?: TimelineSection[];
  meta?: ChatHistoryMeta;
}

export type TimelineListItem =
  | {
      type: "section";
      id: string;
      title: string;
    }
  | {
      type: "conversation";
      id: string;
      conversationId: string;
      status: string | null;
      summaryTitle: string | null;
      conversation_subtitle: string | null;
    };
