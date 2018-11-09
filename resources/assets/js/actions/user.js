import { store } from '../components/App';

export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const DELETE_TOKEN = 'DELETE_TOKEN';

export function userAuthenticate({ token }) {
  return async function (dispatch) {
    try {
      const { authType } = store.getState().user;

      const response = await fetch('/api/v1/account/verify', {
        headers: {
          Authorization: `${authType} ${token}`,
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

export function userUpdate(user = {}) {
  console.log('Update user', user);

  return {
    type: UPDATE_USER,
    data: {
      user,
    },
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

      const response = await fetch('/api/v1/account/register', {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
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

      const response = await fetch('/api/v1/account/login', {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
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
      const { authType } = store.getState().user;

      const data = JSON.stringify({
        refreshToken,
      });

      const response = await fetch('/api/v1/account/logout', {
        body: data,
        headers: {
          Authorization: `${authType} ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const json = await response.json();

      console.log('User logout', json);

      return dispatch({
        type: LOGOUT_USER,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function refreshToken({ token, refreshToken }) {
  return async function () {
    try {
      const { authType } = store.getState().user;

      const data = JSON.stringify({
        refreshToken,
      });

      const response = await fetch('/api/v1/account/token/refresh', {
        body: data,
        headers: {
          Authorization: `${authType} ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const json = await response.json();

      console.log('Token refresh', json);
    } catch (err) {
      console.error(err);
    }
  };
}
