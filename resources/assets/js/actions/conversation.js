import axios from 'axios';

import { store } from '../components/App';

import { LOGOUT_USER } from './user';

export const GET_USERS = 'GET_USERS';
export const CURRENT_CONVERSATION = 'CURRENT_CONVERSATION';
export const ALL_CONVERSATIONS = 'ALL_CONVERSATIONS';

export function getUsers({ token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const json = await axios({
        url: '/api/v1/user/',
        headers: {
          Authorization: `${type} ${token}`,
        },
      });

      console.log('Get Users', json);

      if (json.data.success) {
        const { users } = json.data;

        return dispatch({
          type: GET_USERS,
          data: {
            users,
          },
        });
      }

      return dispatch({
        type: LOGOUT_USER,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getUser({ userId, token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const json = await axios({
        url: `/api/v1/user/${userId}`,
        headers: {
          Authorization: `${type} ${token}`,
        },
      });

      console.log('Get user', json);
      if (!json.data.success) {
        return dispatch({
          type: LOGOUT_USER,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function getConversation({ conversationId, token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const json = await axios({
        url: `/api/v1/conversation/${conversationId}`,
        headers: {
          Authorization: `${type} ${token}`,
        },
      });

      console.log('Get Conversation', json);

      if (json.data.success) {
        const { messages } = json.data;

        return dispatch({
          type: CURRENT_CONVERSATION,
          data: {
            messages,
          },
        });
      }

      return dispatch({
        type: LOGOUT_USER,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getConversations({ token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const json = await axios({
        url: '/api/v1/conversation/',
        headers: {
          Authorization: `${type} ${token}`,
        },
      });

      console.log('Get user conversations', json);

      if (json.data.success) {
        const { conversations } = json.data;

        return dispatch({
          type: ALL_CONVERSATIONS,
          data: {
            conversations,
          },
        });
      }

      return dispatch({
        type: LOGOUT_USER,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function newConversation({ recipientId, message, token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const data = JSON.stringify({
        content: message,
      });

      const json = await axios({
        method: 'POST',
        url: `/api/v1/conversation/new/${recipientId}`,
        headers: {
          Authorization: `${type} ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      console.log('New Conversation', json);

      if (json.data.success) {
        const { conversationId } = json.data;

        return conversationId;
      }

      return dispatch({
        type: LOGOUT_USER,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function sendReply({ conversationId, message, token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const data = JSON.stringify({
        content: message,
      });

      const json = await axios({
        method: 'POST',
        url: `/api/v1/conversation/${conversationId}`,
        headers: {
          Authorization: `${type} ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      console.log(json);

      if (json.data.success) {
        return true;
      }

      return dispatch({
        type: LOGOUT_USER,
      });
    } catch (err) {
      console.error(err);
    }
  };
}
