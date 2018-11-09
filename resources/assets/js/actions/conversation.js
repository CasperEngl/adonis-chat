import { store } from '../components/App';

import { LOGOUT_USER } from './user';

export const GET_USERS = 'GET_USERS';
export const CURRENT_CONVERSATION = 'CURRENT_CONVERSATION';
export const ALL_CONVERSATIONS = 'ALL_CONVERSATIONS';

export function getUsers({ token }) {
  return async function (dispatch) {
    try {
      const { authType } = store.getState().user;

      const response = await fetch('/api/v1/user/', {
        headers: {
          Authorization: `${authType} ${token}`,
        },
      });
      const json = await response.json();

      console.log('Get Users', json);

      if (json.success) {
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
      const { authType } = store.getState().user;

      const response = await fetch(`/api/v1/user/${userId}`, {
        headers: {
          Authorization: `${authType} ${token}`,
        },
      });
      const json = await response.json();

      console.log('Get user', json);
      if (!json.success) {
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
      const { authType } = store.getState().user;

      const response = await fetch(`/api/v1/conversation/${conversationId}`, {
        headers: {
          Authorization: `${authType} ${token}`,
        },
      });
      const json = await response.json();

      console.log('Get Conversation', json);

      if (json.success) {
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
      const { authType } = store.getState().user;

      const response = await fetch('/api/v1/conversation/', {
        headers: {
          Authorization: `${authType} ${token}`,
        },
      });
      const json = await response.json();

      console.log('Get user conversations', json);

      if (json.success) {
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
      const { authType } = store.getState().user;

      const data = JSON.stringify({
        content: message,
      });

      const response = await fetch(`/api/v1/conversation/new/${recipientId}`, {
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${authType} ${token}`,
        },
        method: 'POST',
      });
      const json = await response.json();

      console.log('New Conversation', json);

      if (json.success) {
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
      const { authType } = store.getState().user;

      const data = JSON.stringify({
        content: message,
      });

      const response = await fetch(`/api/v1/conversation/${conversationId}`, {
        body: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${authType} ${token}`,
        },
        method: 'POST',
      });
      const json = await response.json();

      console.log(json);

      if (json.success) {
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
