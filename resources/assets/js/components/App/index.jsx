import React from 'react';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  createStore,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  load,
  save,
} from 'redux-localstorage-simple';
import thunk from 'redux-thunk';

import ChatApp from '../ChatApp';

import rootReducer from '../../reducers/root';

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(...middleware, save())),
);

const App = () => (
  <Provider store={store}>
    <ChatApp />
  </Provider>
);

export default App;
