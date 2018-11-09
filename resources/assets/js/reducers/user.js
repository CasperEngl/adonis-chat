import {
  AUTHENTICATE_USER, UPDATE_USER, LOGIN_USER, LOGOUT_USER, DELETE_TOKEN,
} from '../actions/user';

const initialState = {
  isAuthenticated: false,
  token: '',
  refreshToken: '',
  authType: '',
  account: {},
};

export default (state = initialState, action) => {
  const { type, data } = action;

  switch (type) {
    case AUTHENTICATE_USER:
      return {
        ...state,
        isAuthenticated: data.status,
      };
    case UPDATE_USER:
      return {
        ...state,
        account: data,
      };
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true,
        token: data.user.token,
        refreshToken: data.user.refreshToken,
        authType: data.user.authType,
        account: data.user.account,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: initialState.isAuthenticated,
        token: initialState.token,
        refreshToken: initialState.refreshToken,
        authType: initialState.authType,
        account: initialState.account,
      };
    case DELETE_TOKEN:
      return {
        ...state,
        token: initialState.token,
      };

    default:
      return state;
  }
};
