import {
  AUTHENTICATE_USER,
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_TOKENS,
} from '../actions/user';

const initialState = {
  isAuthenticated: false,
  tokens: {
    token: '',
    refreshToken: '',
    type: '',
  },
  account: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
  },
};

export default (state = initialState, action) => {
  const { type, data } = action;

  switch (type) {
    case AUTHENTICATE_USER:
      return {
        ...state,
        isAuthenticated: data.status,
      };
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true,
        tokens: data.user.tokens,
        account: data.user.account,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: initialState.isAuthenticated,
        tokens: initialState.tokens,
        account: initialState.account,
      };
    case UPDATE_TOKENS:
      return {
        ...state,
        tokens: data.tokens,
      };

    default:
      return state;
  }
};
