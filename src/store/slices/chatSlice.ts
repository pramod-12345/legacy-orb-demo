import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormattedChatMessage } from '../../types/chat';
import { TimelineSection } from '../../types/timeline';

interface ChatState {
  messages: FormattedChatMessage[];
  conversationId: string | null;
  conversationStatus: string | null;
  timelineData: TimelineSection[];
  timelineCurrentPage: number;
  timelineTotalPages: number;
  timelineLastFetchedAt: number | null;
}

const initialState: ChatState = {
  messages: [],
  conversationId: null,
  conversationStatus: null,
  timelineData: [],
  timelineCurrentPage: 1,
  timelineTotalPages: 1,
  timelineLastFetchedAt: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<FormattedChatMessage[]>) => {
      state.messages = action.payload;
    },
    appendMessages: (state, action: PayloadAction<FormattedChatMessage[]>) => {
      // GiftedChat.append like logic: new messages at the beginning
      state.messages = [...action.payload, ...state.messages];
    },
    addUniqueMessage: (state, action: PayloadAction<FormattedChatMessage>) => {
      const exists = state.messages.some(m => m._id === action.payload._id);
      if (!exists) {
        state.messages = [action.payload, ...state.messages];
      }
    },
    setConversationId: (state, action: PayloadAction<string | null>) => {
      state.conversationId = action.payload;
    },
    setConversationStatus: (state, action: PayloadAction<string | null>) => {
      state.conversationStatus = action.payload;
    },
    setTimelineData: (state, action: PayloadAction<TimelineSection[]>) => {
      state.timelineData = action.payload;
      state.timelineLastFetchedAt = Date.now();
    },
    appendTimelineSections: (state, action: PayloadAction<TimelineSection[]>) => {
      const nextSections = action.payload;
      const mergedSections = [...state.timelineData];

      nextSections.forEach(nextSection => {
        const existingIndex = mergedSections.findIndex(
          section => section.date === nextSection.date,
        );

        if (existingIndex === -1) {
          mergedSections.push(nextSection);
        } else {
          const existingIds = new Set(
            mergedSections[existingIndex].memoryLists.map(item => item.id),
          );

          const uniqueNewItems = nextSection.memoryLists.filter(
            item => !existingIds.has(item.id),
          );

          mergedSections[existingIndex] = {
            ...mergedSections[existingIndex],
            memoryLists: [
              ...mergedSections[existingIndex].memoryLists,
              ...uniqueNewItems,
            ],
          };
        }
      });
      state.timelineData = mergedSections;
      state.timelineLastFetchedAt = Date.now();
    },
    setTimelineMeta: (
      state,
      action: PayloadAction<{ page: number; totalPages: number }>,
    ) => {
      state.timelineCurrentPage = action.payload.page;
      state.timelineTotalPages = action.payload.totalPages;
    },
    resetTimeline: state => {
      state.timelineData = [];
      state.timelineCurrentPage = 1;
      state.timelineTotalPages = 1;
      state.timelineLastFetchedAt = null;
    },
    resetChat: state => {
      state.messages = [];
      state.conversationId = null;
      state.conversationStatus = null;
    },
  },
});

export const {
  setMessages,
  appendMessages,
  addUniqueMessage,
  setConversationId,
  setConversationStatus,
  setTimelineData,
  appendTimelineSections,
  setTimelineMeta,
  resetTimeline,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
