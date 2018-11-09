import axios from 'axios';

import { store } from '../components/App';

export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';
export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_TOKENS = 'UPDATE_TOKENS';

export function userAuthenticate({ token }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const response = await axios({
        url: '/api/v1/account/verify',
        headers: {
          Authorization: `${type} ${token}`,
        },
      });
      const json = await response.json();

      console.log('User Authentication', json);

      if (json.success) {
        return dispatch({
          type: AUTHENTICATE_USER,
          data: {
            status: json.success, // Dispatch the success status from the server
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function userRegister({
  email,
  firstName,
  lastName,
  password,
}) {
  return async function () {
    try {
      const data = JSON.stringify({
        email,
        firstName,
        lastName,
        password,
      });

      const response = await axios({
        method: 'POST',
        url: '/api/v1/account/register',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
      const json = await response.json();

      console.log('User Register', json);
    } catch (err) {
      console.error(err);
    }
  };
}

export function userLogin({ email, password }) {
  return async function (dispatch) {
    try {
      const data = JSON.stringify({
        email,
        password,
      });

      const response = await axios({
        method: 'POST',
        url: '/api/v1/account/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
      const json = await response.json();

      console.log('User login', json);

      if (json.success) {
        const {
          user,
        } = json.data;

        return dispatch({
          type: LOGIN_USER,
          data: {
            status: json.success,
            user,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function userLogout({ token, refreshToken }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const data = JSON.stringify({
        refreshToken,
      });

      const response = await axios({
        method: 'POST',
        url: '/api/v1/account/logout',
        headers: {
          Authorization: `${type} ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });
      const json = await response.json();

      console.log('User logout', json);
    } catch (err) {
      console.error(err);
    }

    return dispatch({
      type: LOGOUT_USER,
    });
  };
}

export function updateTokens({ token, refreshToken }) {
  return async function (dispatch) {
    try {
      const { type } = store.getState().user.tokens;

      const data = JSON.stringify({
        refreshToken,
      });

      const response = await axios({
        method: 'POST',
        url: '/api/v1/account/token/',
        headers: {
          Authorization: `${type} ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });
      const json = await response.json();

      console.log('Token refresh', json);

      if (json.success) {
        return dispatch({
          type: UPDATE_TOKENS,
          data: {
            ...json.data,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}
