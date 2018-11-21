import {
  NAV_CLOSE,
  NAV_TOGGLE,
  EMOJIS_CLOSE,
  EMOJIS_TOGGLE,
} from '../actions/ui';

const initialState = {
  navOpen: false,
  emojisOpen: false,
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
        navOpen: initialState.navOpen,
      };
    case EMOJIS_TOGGLE:
      return {
        ...state,
        emojisOpen: !state.emojisOpen,
      };
    case EMOJIS_CLOSE:
      return {
        ...state,
        emojisOpen: initialState.emojisOpen,
      };

    default:
      return state;
  }
};
