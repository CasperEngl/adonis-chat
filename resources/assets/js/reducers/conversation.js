import {
  GET_USERS,
  CURRENT_CONVERSATION,
  ALL_CONVERSATIONS,
  NEW_MESSAGE,
} from '../actions/conversation';

const initialState = {
  users: [
    {
      id: 0,
      email: '',
    },
  ],
  current: {
    id: 0,
    createdAt: '',
    updatedAt: '',
    messages: [
      {
        id: 0,
        conversationId: 0,
        userId: 0,
        content: '',
        createdAt: '',
        updatedAt: '',
      },
    ],
    users: [
      {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
      },
    ],
  },
  conversations: [
    {
      id: 0,
      createdAt: '',
      updatedAt: '',
      message: {
        id: 0,
        conversationId: 0,
        userId: 0,
        content: '',
        createdAt: '',
        updatedAt: '',
      },
      users: [
        {
          id: 0,
          firstName: '',
          lastName: '',
          email: '',
        },
      ],
    },
  ],
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
        current: {
          ...data,
        },
      };
    case ALL_CONVERSATIONS:
      return {
        ...state,
        conversations: data.conversations,
      };
    case NEW_MESSAGE:
      return {
        ...state,
        current: {
          ...state.current,
          messages: [
            ...state.current.messages,
            {
              ...data.message,
            },
          ],
        },
      };

    default:
      return state;
  }
};
