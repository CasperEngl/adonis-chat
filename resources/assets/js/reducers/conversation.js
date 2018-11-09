import { GET_USERS, CURRENT_CONVERSATION, ALL_CONVERSATIONS } from '../actions/conversation';

const initialState = {
  users: [],
  currentConversation: {},
  conversations: [],
};

export default (state = initialState, action) => {
  const { type, data } = action;

  switch (type) {
    case GET_USERS:
      return {
        ...state,
        users: data.users,
      };
    case CURRENT_CONVERSATION:
      return {
        ...state,
        currentConversation: {
          participants: [],
          messages: data.messages,
        },
      };
    case ALL_CONVERSATIONS:
      return {
        ...state,
        conversations: data.conversations,
      };

    default:
      return state;
  }
};
