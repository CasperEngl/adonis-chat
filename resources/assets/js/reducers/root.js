import { combineReducers } from 'redux';

import ui from './ui';
import user from './user';
import conversation from './conversation';

const rootReducer = combineReducers({
  ui,
  user,
  conversation,
});

export default rootReducer;
