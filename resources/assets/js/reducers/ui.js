import { NAV_CLOSE, NAV_TOGGLE } from '../actions/ui';

const initialState = {
  navOpen: false,
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case NAV_TOGGLE:
      return {
        ...state,
        navOpen: !state.navOpen,
      };
    case NAV_CLOSE:
      return {
        ...state,
        navOpen: false,
      };

    default:
      return state;
  }
};
