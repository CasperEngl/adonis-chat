import axios from 'axios';

import { store } from '../components/App';
import { checkToken } from './token';

export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_TOKENS = 'UPDATE_TOKENS';

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

      const json = await checkToken(axios({
        method: 'POST',
        url: '/api/v1/account/register',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      }));

      console.log('User Register', json);

      return {
        success: Boolean(json.status === 200),
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
      };
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

      const json = await checkToken(axios({
        method: 'POST',
        url: '/api/v1/account/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      }));

      console.log('User login', json);

      if (json.status === 200) {
        const {
          user,
        } = json.data;

        return dispatch({
          type: LOGIN_USER,
          data: {
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

      const json = await checkToken(axios({
        method: 'POST',
        url: '/api/v1/account/logout',
        headers: {
          Authorization: `${type} ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      }));

      console.log('User logout', json);
    } catch (err) {
      console.error(err);
    }

    return dispatch({
      type: LOGOUT_USER,
    });
  };
}
